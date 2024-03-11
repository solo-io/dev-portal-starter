import { CloseButton, Flex, Loader, Select } from "@mantine/core";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { ApiProductSummary, App } from "../../../../Apis/api-types";
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
  apiProduct?: ApiProductSummary;
}) => {
  di(useListTeams, useCreateAppMutation);

  //
  //  Form state
  //
  const [formApiProductId, setFormApiProductId] = useState(
    apiProduct?.id ?? ""
  );
  const [formAppId, setFormAppId] = useState(app?.id ?? "");

  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !formRef.current?.checkValidity();
  const resetForm = () => {
    setFormApiProductId("");
    setFormAppId("");
  };

  //
  //  Get App and APIProduct selection options
  //
  const { isLoading: isLoadingTeams, data: teams } = useListTeams();
  const { isLoading: isLoadingApps, data: appsForTeams } = useListAppsForTeams(
    teams ?? []
  );
  const apps = useMemo(() => {
    return appsForTeams?.flat() ?? [];
  }, [appsForTeams]);

  //
  //  Form Submit logic
  //
  const { isLoading: isLoadingApiProducts, data: apiProducts } =
    useListApiProducts();
  const { trigger: createSubscription } =
    useCreateSubscriptionMutation(formAppId);

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    // Do HTML form validation.
    formRef.current?.reportValidity();
    if (isFormDisabled) {
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

  // Reset the form on close.
  useEffect(() => {
    if (!opened) resetForm();
  }, [opened]);

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
