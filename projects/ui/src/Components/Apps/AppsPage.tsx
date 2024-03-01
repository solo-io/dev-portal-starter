import { di } from "react-magnetic-di";
import { useListApis, useListApps } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Loading } from "../Common/Loading";
import { PageContainer } from "../Common/PageContainer";
import { AppsPageContent } from "./PageContent/AppsPageContent";

export function AppsPage() {
  di(useListApis);
  const { isLoading } = useListApps("abc");

  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Apps"} logo={<Icon.AppIcon />} />}
        description={"Browse the list of Apps in this portal."}
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Apps" }]}
      />

      {isLoading ? (
        // Make sure the APIs are finished loading since they are a dependency of both tabs.
        <Loading message="Getting list of apps..." />
      ) : (
        <AppsPageContent />
      )}
    </PageContainer>
  );
}
