import { App } from "../../../Apis/api-types";
import { BannerHeading } from "../../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../../Common/PageContainer";
import ApiSubscriptionsSection from "./ApiSubscriptionsSection/AppApiSubscriptionsSection";
import AppAuthenticationSection from "./AuthenticationSection/AppAuthenticationSection";

const AppDetailsPageContent = ({ app }: { app: App }) => {
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
        // fullIcon={<Icon.Bug />}
        description={app.description}
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "Apps", link: "/apps" },
          { label: app.name },
        ]}
      />
      <AppAuthenticationSection />
      <ApiSubscriptionsSection />
    </PageContainer>
  );
};

export default AppDetailsPageContent;
