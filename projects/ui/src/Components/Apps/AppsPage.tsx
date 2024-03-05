import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../Common/PageContainer";
import { AppsPageContent } from "./PageContent/AppsPageContent";

export function AppsPage() {
  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Apps"} logo={<Icon.AppIcon />} />}
        description={"Browse the list of Apps in this portal."}
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Apps" }]}
      />

      <AppsPageContent />
    </PageContainer>
  );
}
