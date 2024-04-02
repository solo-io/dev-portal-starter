import { Box } from "@mantine/core";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../Common/PageContainer";
import { TeamsList } from "../Common/TeamsList/TeamsList";

const AdminTeamsPage = () => {
  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Teams"} logo={<Icon.TeamsIcon />} />}
        description={<>Browse the list of teams.</>}
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Teams" }]}
      />
      <Box px={"30px"} pb={"10px"}>
        <TeamsList />
      </Box>
    </PageContainer>
  );
};

export default AdminTeamsPage;
