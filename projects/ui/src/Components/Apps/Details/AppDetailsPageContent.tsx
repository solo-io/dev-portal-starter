import { Loader } from "@mantine/core";
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
      {appHasOAuthClient && <AppAuthenticationSection app={app} />}
      {isLoadingSubscriptions ? (
        <Loader />
      ) : // TODO: Figure out view for when the user isn't an admin. Currently just hides the section.
      !!subscriptionsError ? null : (
        <ApiSubscriptionsSection app={app} subscriptions={subscriptions!} />
      )}
    </PageContainer>
  );
};

export default AppDetailsPageContent;
