import { Box, Flex, Tooltip } from "@mantine/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "../../../../Assets/Icons";
import { useIsAdmin } from "../../../../Context/AuthContext";
import { CardStyles } from "../../../../Styles/shared/Card.style";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { MetadataDisplay } from "../../../../Utility/AdminUtility/MetadataDisplay";
import {
  getAppDetailsLink,
  getTeamDetailsLink,
} from "../../../../Utility/link-builders";
import { SubscriptionInfoCardStyles } from "../../../Common/SubscriptionsList/SubscriptionInfoCard/SubscriptionInfoCard.style";
import { AppWithTeam } from "../AppsList";

/**
 * MAIN COMPONENT
 **/
export function AppSummaryGridCard({ app }: { app: AppWithTeam }) {
  const isAdmin = useIsAdmin();
  const [isManagingMetadata, setIsManagingMetadata] = useState(false);

  return (
    <GridCardStyles.GridCard whiteBg wide={isManagingMetadata}>
      <div className="content">
        <Box p={"20px"}>
          <Flex direction={"column"} align={"flex-start"} gap={"5px"}>
            <CardStyles.TitleSmall bold>{app.name}</CardStyles.TitleSmall>
            <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
              <Tooltip label="Team" position="right">
                <UtilityStyles.NavLinkContainer
                  withArrow={false}
                  flexCenter={true}
                >
                  <NavLink to={getTeamDetailsLink(app.team)}>
                    <Icon.TeamsIcon width={20} />
                    {app.team.name}
                  </NavLink>
                </UtilityStyles.NavLinkContainer>
              </Tooltip>
            </Flex>
            <CardStyles.Description>{app.description}</CardStyles.Description>
            <MetadataDisplay
              itemType="app"
              itemId={app.id}
              customMetadata={app.metadata?.customMetadata}
              rateLimitInfo={app.metadata?.rateLimit}
              onIsManagingMetadataChange={(value) =>
                setIsManagingMetadata(value)
              }
            />
          </Flex>
        </Box>
      </div>
      {!isAdmin && (
        <SubscriptionInfoCardStyles.Footer>
          <UtilityStyles.NavLinkContainer>
            <NavLink to={getAppDetailsLink(app)}>DETAILS</NavLink>
          </UtilityStyles.NavLinkContainer>
        </SubscriptionInfoCardStyles.Footer>
      )}
    </GridCardStyles.GridCard>
  );
}
