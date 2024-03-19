import { CloseButton, Flex, Loader, Select } from "@mantine/core";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import {
  ApiProductDetails,
  ApiProductSummary,
  App,
} from "../../../../Apis/api-types";
import {
  useCreateAppMutation,
  useCreateSubscriptionMutation,
  useListApiProducts,
  useListAppsForTeams,
  useListTeams,
} from "../../../../Apis/hooks";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { Button } from "../../../Common/Button";
import { Loading } from "../../../Common/Loading";

/**
 * This modal is used to add `App -> API Product` subscriptions and is reusable in different contexts.
 *
 *   - Creating a subscription requires an App ID and API Product ID.
 *   - If `app` is supplied, the app selection won't be shown since it will use the supplied `app.id`.
 *   - Similarly, if `apiProduct` is supplied, the API Product selection won't be shown since it will use the supplied `apiProduct.id`.
 */
const NewSubscriptionModal = ({
  opened,
  onClose,
  app,
  apiProduct,
}: {
  opened: boolean;
  onClose: () => void;
  app?: App;
  apiProduct?: ApiProductSummary | ApiProductDetails;
}) => {
  di(
    useListTeams,
    useListApiProducts,
    useListAppsForTeams,
    useCreateAppMutation
  );
  const { isLoading: isLoadingApiProducts, data: apiProducts } =
    useListApiProducts();
  const { isLoading: isLoadingTeams, data: teams } = useListTeams();
  const { isLoading: isLoadingApps, data: appsForTeams } = useListAppsForTeams(
    teams ?? []
  );
  const apps = useMemo(() => appsForTeams?.flat() ?? [], [appsForTeams]);

  //
  // Form Fields
  //
  const [formApiProductId, setFormApiProductId] = useState(
    apiProduct?.id ?? ""
  );
  const [formAppId, setFormAppId] = useState(app?.id ?? "");

  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !formRef.current?.checkValidity();
  useEffect(() => {
    // The form resets here when `open` or the default fields change.
    setFormApiProductId(apiProduct?.id ?? "");
    setFormAppId(app?.id ?? "");
  }, [apiProduct, app, opened]);

  //
  //  Form Submit
  //
  const { trigger: createSubscription } =
    useCreateSubscriptionMutation(formAppId);
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
      return;
    }
    await toast.promise(
      createSubscription({ apiProductId: formApiProductId }),
      {
        error: "There was an error creating the subscription.",
        loading: "Creating the subscription...",
        success: "Created the subscription!",
      }
    );
    onClose();
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal
      onClose={onClose}
      opened={opened}
      size={"800px"}
    >
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>
            Create a New Subscription
          </FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Create a new Subscription.
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton onClick={onClose} title="Close modal" size={"30px"} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      {isLoadingTeams || teams === undefined ? (
        <Loading />
      ) : (
        <FormModalStyles.BodyContainerForm ref={formRef} onSubmit={onSubmit}>
          {!app &&
            (isLoadingApps || !apps ? (
              <Loader />
            ) : (
              <FormModalStyles.InputContainer>
                <label htmlFor="app-select">App</label>
                <Select
                  id="app-select"
                  // This className="" is intentional and removes the antd select dropdown classname.
                  className=""
                  value={formAppId}
                  onChange={(value) => {
                    setFormAppId(value ?? "");
                  }}
                  data={[
                    {
                      value: "",
                      label: "Select an App",
                      disabled: true,
                    },
                    ...apps.map((app) => ({
                      value: app.id,
                      label: app.name,
                    })),
                  ]}
                />
              </FormModalStyles.InputContainer>
            ))}
          {!apiProduct &&
            (isLoadingApiProducts || !apiProducts ? (
              <Loader />
            ) : (
              <FormModalStyles.InputContainer>
                <label htmlFor="api-product-select">API Product</label>
                <Select
                  id="api-product-select"
                  // This className="" is intentional and removes the antd select dropdown classname.
                  className=""
                  value={formApiProductId}
                  onChange={(value) => {
                    setFormApiProductId(value ?? "");
                  }}
                  data={[
                    {
                      value: "",
                      label: "Select an API Product",
                      disabled: true,
                    },
                    ...apiProducts.map((ap) => ({
                      value: ap.id,
                      label: ap.name,
                    })),
                  ]}
                />
              </FormModalStyles.InputContainer>
            ))}
          <Flex justify={"flex-end"} gap="20px">
            <Button className="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button disabled={isFormDisabled} onClick={onSubmit} type="submit">
              Create Subscription
            </Button>
          </Flex>
        </FormModalStyles.BodyContainerForm>
      )}
    </FormModalStyles.CustomModal>
  );
};

export default NewSubscriptionModal;
