import { Box, CloseButton, Flex, Loader, Select } from "@mantine/core";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import {
  ApiProductDetails,
  ApiProductSummary,
  App,
} from "../../../../Apis/api-types";
import {
  useCreateAppAndSubscriptionMutation,
  useCreateAppMutation,
  useCreateSubscriptionMutation,
  useListApiProducts,
  useListAppsForTeams,
  useListTeams,
} from "../../../../Apis/hooks";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { omitErrorMessageResponse } from "../../../../Utility/utility";
import { Accordion } from "../../../Common/Accordion";
import { Button } from "../../../Common/Button";
import { Loading } from "../../../Common/Loading";
import ToggleAddButton from "../../../Common/ToggleAddButton";
import CreateNewAppFormContents from "../../Modals/CreateNewAppFormContents";

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
  const apps = useMemo(
    () =>
      (appsForTeams
        ?.flat()
        .filter((app) => !!omitErrorMessageResponse(app)) as App[]) ?? [],
    [appsForTeams]
  );

  //
  // Form Fields
  //
  const [formApiProductId, setFormApiProductId] = useState(
    apiProduct?.id ?? ""
  );
  const [isShowingAddAppSubSection, setIsShowingAddAppSubSection] =
    useState(false);
  // For choosing an existing app:
  const [formAppId, setFormAppId] = useState(app?.id ?? "");
  // For new apps:
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appTeamId, setAppTeamId] = useState("");

  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled =
    (!apiProduct && !app) ||
    (!!apiProduct &&
      (isShowingAddAppSubSection
        ? !appName || !appDescription || !appTeamId
        : !formAppId));
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
  const { trigger: createAppAndSubscription } =
    useCreateAppAndSubscriptionMutation();
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
      return;
    }
    if (!!isShowingAddAppSubSection) {
      // If we are adding a new app, create app and subscription.
      await toast.promise(
        createAppAndSubscription({
          appName,
          appDescription,
          appTeamId,
          apiProductId: formApiProductId,
        }),
        {
          error: "There was an error creating the app and subscription.",
          loading: "Creating the app and subscription...",
          success: "Created the app and subscription!",
        }
      );
    } else {
      // Otherwise just create the subscription.
      await toast.promise(
        createSubscription({ apiProductId: formApiProductId }),
        {
          error: "There was an error creating the subscription.",
          loading: "Creating the subscription...",
          success: "Created the subscription!",
        }
      );
    }
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
            Create a new subscription.
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
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
                <Box mb="10px">
                  <Flex justify={"space-between"} align={"center"}>
                    <FormModalStyles.SectionTitle>
                      {isShowingAddAppSubSection ? "Create a New" : "Choose"}{" "}
                      App
                    </FormModalStyles.SectionTitle>
                    <ToggleAddButton
                      topicUpperCase="APP"
                      isAdding={isShowingAddAppSubSection}
                      toggleAdding={() =>
                        setIsShowingAddAppSubSection(!isShowingAddAppSubSection)
                      }
                    />
                  </Flex>
                </Box>
                <Accordion open={!!isShowingAddAppSubSection}>
                  <GridCardStyles.GridCard wide>
                    <Box py={"15px"} px={"30px"}>
                      <CreateNewAppFormContents
                        formEnabled={isShowingAddAppSubSection}
                        teams={teams}
                        formFields={{
                          appName,
                          appDescription,
                          appTeamId,
                        }}
                        formFieldSetters={{
                          setAppName,
                          setAppDescription,
                          setAppTeamId,
                        }}
                      />
                    </Box>
                  </GridCardStyles.GridCard>
                </Accordion>
                <Accordion open={!isShowingAddAppSubSection}>
                  <Select
                    id="app-select"
                    aria-label="Choose app"
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
                </Accordion>
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
              Create{isShowingAddAppSubSection ? " App and" : ""} Subscription
            </Button>
          </Flex>
        </FormModalStyles.BodyContainerForm>
      )}
    </FormModalStyles.CustomModal>
  );
};

export default NewSubscriptionModal;
