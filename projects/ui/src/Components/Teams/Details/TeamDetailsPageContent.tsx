import { Box, Flex } from "@mantine/core";
import { Team } from "../../../Apis/api-types";
import { BannerHeading } from "../../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../../Common/PageContainer";
import TeamAppsSection from "./AppsSection/TeamAppsSection";
import TeamUsersSection from "./UsersSection/TeamUsersSection";

const TeamDetailsPageContent = ({ team }: { team: Team }) => {
  return (
    <PageContainer>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={team.name}
            stylingTweaks={{
              fontSize: "32px",
              lineHeight: "36px",
            }}
          />
        }
        description={team.description}
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "Teams", link: "/teams" },
          { label: team.name },
        ]}
      />
      <Box px={"30px"} pb={"30px"}>
        <Flex gap={"30px"} direction={"column"}>
          <TeamUsersSection team={team} />
          <TeamAppsSection team={team} />
        </Flex>
      </Box>
    </PageContainer>
  );
};

export default TeamDetailsPageContent;