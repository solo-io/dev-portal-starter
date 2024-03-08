import { Box, Flex, Loader } from "@mantine/core";
import { di } from "react-magnetic-di";
import { App } from "../../../Apis/api-types";
import { useListSubscriptionsForApp } from "../../../Apis/hooks";
import { BannerHeading } from "../../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../../Common/Banner/BannerHeadingTitle";
import { EmptyData } from "../../Common/EmptyData";
import { PageContainer } from "../../Common/PageContainer";
import ApiSubscriptionsSection from "./ApiSubscriptionsSection/AppApiSubscriptionsSection";
import AppAuthenticationSection from "./AuthenticationSection/AppAuthenticationSection";

const AppDetailsPageContent = ({ app }: { app: App }) => {
  di(useListSubscriptionsForApp);
  const { isLoading: isLoadingSubscriptions, data: subscriptions } =
    useListSubscriptionsForApp(app.id);
  const subscriptionsError =
    subscriptions !== undefined && "message" in subscriptions;

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
          />
        }
        description={app.description}
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "Apps", link: "/apps" },
          { label: app.name },
        ]}
      />
      {!appHasOAuthClient && subscriptionsError && (
        <EmptyData
          topicMessageOverride="App details unavailable."
          message="Only admins may view app subscription data."
        />
      )}
      <Box px={30}>
        <Flex gap={"30px"} direction={"column"}>
          {appHasOAuthClient && <AppAuthenticationSection app={app} />}
          {isLoadingSubscriptions ? (
            <Loader />
          ) : // TODO: Figure out view for when the user isn't an admin. Currently just hides the section.
          !!subscriptionsError ? null : (
            <ApiSubscriptionsSection app={app} subscriptions={subscriptions!} />
          )}
        </Flex>
      </Box>
    </PageContainer>
  );
};

export default AppDetailsPageContent;
