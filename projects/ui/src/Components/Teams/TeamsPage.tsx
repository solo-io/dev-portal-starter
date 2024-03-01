import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../Common/PageContainer";
import { TeamsList } from "./PageContent/TeamsList";

export function TeamsPage() {
  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Teams"} logo={<Icon.TeamsIcon />} />}
        description={"Browse the list of Teams in this portal."}
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Teams" }]}
      />

      <TeamsList />
    </PageContainer>
  );
}
