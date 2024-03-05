import { di } from "react-magnetic-di";
import { useListTeams } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Loading } from "../Common/Loading";
import { PageContainer } from "../Common/PageContainer";
import { AppsPageContent } from "./PageContent/AppsPageContent";

export function AppsPage() {
  di(useListTeams);
  const { isLoading } = useListTeams();

  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Apps"} logo={<Icon.AppIcon />} />}
        description={"Browse the list of Apps in this portal."}
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Apps" }]}
      />

      {isLoading ? (
        // Make sure the teams are finished loading since they are a dependency.
        <Loading message="Loading..." />
      ) : (
        <AppsPageContent />
      )}
    </PageContainer>
  );
}
