import { Box, Flex } from "@mantine/core";
import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { NavLink } from "react-router-dom";
import { Team } from "../../../../Apis/api-types";
import { useListApps, useListMembers } from "../../../../Apis/hooks";
import { Icon } from "../../../../Assets/Icons";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { getTeamDetailsLink } from "../../../../Utility/link-builders";
import { SubscriptionInfoCardStyles } from "../../../Apis/PendingSubscriptionsTab/SubscriptionInfoCard.style";
import { Loading } from "../../../Common/Loading";

/**
 * MAIN COMPONENT
 **/
export function TeamSummaryGridCard({ team }: { team: Team }) {
  di(useListApps, useListMembers);
  // In the future banner images may come through API data.
  //   Even when that is the case, a default image may be desired
  //   for when no image is available.
  // Further, you may have some clever trick for setting one of
  //   many default images.
  const defaultCardImage = useMemo(
    () => {
      return "https://img.huffingtonpost.com/asset/57f2730f170000f70aac9059.jpeg?ops=scalefit_960_noupscale";
    },
    // Currently we don't need to change images unless the api itself has changed.
    //   Depending on the function within the memo, this may not always be the case.
    [team.id]
  );

  const { isLoading: isLoadingApps, data: teamApps } = useListApps(team.id);
  const { isLoading: isLoadingMembers, data: teamMembers } = useListMembers(
    team.id
  );

  return (
    <GridCardStyles.GridCard whiteBg>
      <div className="content">
        <Box p={"20px"}>
          <Flex direction={"column"} align={"flex-start"} gap={"5px"}>
            <SubscriptionInfoCardStyles.CardTitleSmall>
              {team.name}
            </SubscriptionInfoCardStyles.CardTitleSmall>
            <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
              <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
                <Icon.AppIcon width={20} />
                {isLoadingApps ? (
                  <Loading small />
                ) : (
                  <SubscriptionInfoCardStyles.Text>
                    {teamApps?.length} App{teamApps?.length === 1 ? "" : "s"}
                  </SubscriptionInfoCardStyles.Text>
                )}
              </Flex>
              |
              <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
                <Icon.UserIcon width={20} />
                {isLoadingMembers ? (
                  <Loading small />
                ) : (
                  <SubscriptionInfoCardStyles.Text>
                    {teamMembers?.length} Member
                    {teamMembers?.length === 1 ? "" : "s"}
                  </SubscriptionInfoCardStyles.Text>
                )}
              </Flex>
            </Flex>
            <GridCardStyles.Description>
              {team.description}
            </GridCardStyles.Description>
          </Flex>
        </Box>
      </div>
      <SubscriptionInfoCardStyles.Footer>
        <NavLink to={getTeamDetailsLink(team)}>MANAGE</NavLink>
      </SubscriptionInfoCardStyles.Footer>
    </GridCardStyles.GridCard>
  );
}
