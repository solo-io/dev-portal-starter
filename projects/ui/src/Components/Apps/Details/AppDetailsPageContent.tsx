import { Box, Flex, Loader } from "@mantine/core";
import { di } from "react-magnetic-di";
import { App } from "../../../Apis/api-types";
import { useListSubscriptionsForApp } from "../../../Apis/hooks";
import { BannerHeading } from "../../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../../Common/PageContainer";
import AppApiSubscriptionsSection from "./ApiSubscriptionsSection/AppApiSubscriptionsSection";
import AppAuthenticationSection from "./AuthenticationSection/AppAuthenticationSection";
import EditAppButtonWithModal from "./EditAppButtonWithModal";

export const AppDetailsPageContent = ({ app }: { app: App }) => {
  di(useListSubscriptionsForApp);
  const { isLoading: isLoadingSubscriptions, data: subscriptions } =
    useListSubscriptionsForApp(app.id);

  // Mock data for testing
  // app.idpClientId = "4df81266-f855-466d-8ded-699056780850";
  // app.idpClientName = "test-idp";
  // app.idpClientSecret = "hidden";
  const appHasOAuthClient =
    app.idpClientId && app.idpClientName && app.idpClientSecret;

  return (
    <PageContainer>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={app.name}
            stylingTweaks={{
              fontSize: "32px",
              lineHeight: "36px",
            }}
            additionalInfo={<EditAppButtonWithModal app={app} />}
          />
        }
        description={app.description}
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "Apps", link: "/apps" },
          { label: app.name },
        ]}
      />
      <Box px={"30px"}>
        <Flex gap={"30px"} direction={"column"}>
          {appHasOAuthClient && <AppAuthenticationSection app={app} />}
          {isLoadingSubscriptions || subscriptions === undefined ? (
            <Loader />
          ) : (
            <AppApiSubscriptionsSection
              app={app}
              subscriptions={!Array.isArray(subscriptions) ? [] : subscriptions}
            />
          )}
        </Flex>
      </Box>
    </PageContainer>
  );
};
