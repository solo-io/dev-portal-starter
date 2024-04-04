import { Box, Flex } from "@mantine/core";
import { useContext } from "react";
import { Team } from "../../../Apis/api-types";
import { AuthContext } from "../../../Context/AuthContext";
import { BannerHeading } from "../../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../../Common/PageContainer";
import TeamAppsSection from "./AppsSection/TeamAppsSection";
import EditTeamButtonWithModal from "./EditTeamButtonWithModal";
import TeamUsersSection from "./UsersSection/TeamUsersSection";

const TeamDetailsPageContent = ({ team }: { team: Team }) => {
  const { isAdmin } = useContext(AuthContext);
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
            additionalInfo={!isAdmin && <EditTeamButtonWithModal team={team} />}
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
          {!isAdmin && <TeamAppsSection team={team} />}
        </Flex>
      </Box>
    </PageContainer>
  );
};

export default TeamDetailsPageContent;
