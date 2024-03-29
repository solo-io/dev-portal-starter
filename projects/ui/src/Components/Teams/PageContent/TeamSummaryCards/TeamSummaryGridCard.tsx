import { Box, Flex } from "@mantine/core";
import { di } from "react-magnetic-di";
import { NavLink } from "react-router-dom";
import { Team } from "../../../../Apis/api-types";
import {
  useListAppsForTeam,
  useListMembersForTeam,
} from "../../../../Apis/hooks";
import { Icon } from "../../../../Assets/Icons";
import { CardStyles } from "../../../../Styles/shared/Card.style";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { getTeamDetailsLink } from "../../../../Utility/link-builders";
import { Loading } from "../../../Common/Loading";
import { SubscriptionInfoCardStyles } from "../../../Common/SubscriptionsList/SubscriptionInfoCard.style";

/**
 * MAIN COMPONENT
 **/
export function TeamSummaryGridCard({ team }: { team: Team }) {
  di(useListAppsForTeam, useListMembersForTeam);

  const { isLoading: isLoadingApps, data: teamApps } = useListAppsForTeam(team);
  const { isLoading: isLoadingMembers, data: teamMembers } =
    useListMembersForTeam(team.id);

  return (
    <GridCardStyles.GridCard whiteBg>
      <div className="content">
        <Box p={"20px"}>
          <Flex direction={"column"} align={"flex-start"} gap={"5px"}>
            <CardStyles.TitleSmall bold>{team.name}</CardStyles.TitleSmall>
            <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
              <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
                <Icon.AppIcon width={20} />
                {isLoadingApps ? (
                  <Loading small />
                ) : (
                  <CardStyles.SmallerText>
                    {teamApps?.length} App{teamApps?.length === 1 ? "" : "s"}
                  </CardStyles.SmallerText>
                )}
              </Flex>
              |
              <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
                <Icon.UserIcon width={20} />
                {isLoadingMembers ? (
                  <Loading small />
                ) : (
                  <CardStyles.SmallerText>
                    {teamMembers?.length} Member
                    {teamMembers?.length === 1 ? "" : "s"}
                  </CardStyles.SmallerText>
                )}
              </Flex>
            </Flex>
            <CardStyles.Description>{team.description}</CardStyles.Description>
          </Flex>
        </Box>
      </div>
      <SubscriptionInfoCardStyles.Footer>
        <UtilityStyles.NavLinkContainer>
          <NavLink to={getTeamDetailsLink(team)}>MANAGE</NavLink>
        </UtilityStyles.NavLinkContainer>
      </SubscriptionInfoCardStyles.Footer>
    </GridCardStyles.GridCard>
  );
}
