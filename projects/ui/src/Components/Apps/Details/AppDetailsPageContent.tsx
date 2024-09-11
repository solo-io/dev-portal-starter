import { Box, Flex, Loader, Tooltip } from "@mantine/core";
import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { NavLink } from "react-router-dom";
import { App } from "../../../Apis/api-types";
import {
  useListSubscriptionsForApp,
  useListTeams,
} from "../../../Apis/gg_hooks";
import { Icon } from "../../../Assets/Icons";
import { UtilityStyles } from "../../../Styles/shared/Utility.style";
import { getTeamDetailsLink } from "../../../Utility/link-builders";
import { BannerHeading } from "../../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../../Common/PageContainer";
import AppApiKeysSection from "./ApiKeysSection/AppApiKeysSection";
import AppApiSubscriptionsSection from "./ApiSubscriptionsSection/AppApiSubscriptionsSection";
import AppAuthenticationSection from "./AuthenticationSection/AppAuthenticationSection";
import EditAppButtonWithModal from "./EditAppButtonWithModal";

export const AppDetailsPageContent = ({ app }: { app: App }) => {
  di(useListSubscriptionsForApp, useListTeams);
  const { isLoading: isLoadingSubscriptions, data: subscriptions } =
    useListSubscriptionsForApp(app.id);

  const { data: teams } = useListTeams();
  const team = useMemo(
    () => teams?.find((t) => t.id === app.teamId),
    [teams, app]
  );

  // Mock data for testing
  // app.idpClientId = "4df81266-f855-466d-8ded-699056780850";
  // app.idpClientName = "test-idp";
  // app.idpClientSecret = "hidden";
  const appHasOAuthClient =
    app.idpClientId && app.idpClientName && app.idpClientSecret;

  return (
    <PageContainer>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={app.name}
            logo={<Icon.AppIcon />}
            stylingTweaks={{
              fontSize: "32px",
              lineHeight: "36px",
            }}
            additionalInfo={<EditAppButtonWithModal app={app} />}
          />
        }
        description={
          <>
            {!!team && !!team.name && (
              <Flex
                align={"center"}
                justify={"flex-start"}
                gap={"8px"}
                sx={{ marginTop: "-5px" }}
              >
                <Tooltip label="Team" position="right">
                  <UtilityStyles.NavLinkContainer
                    withArrow={false}
                    flexCenter={true}
                  >
                    <NavLink to={getTeamDetailsLink(team)}>
                      <Icon.TeamsIcon width={20} />
                      {team?.name}
                    </NavLink>
                  </UtilityStyles.NavLinkContainer>
                </Tooltip>
              </Flex>
            )}
            <Box mt="10px">{app.description}</Box>
          </>
        }
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "Apps", link: "/apps" },
          { label: app.name },
        ]}
      />
      <Box px={"30px"}>
        <Flex gap={"30px"} direction={"column"}>
          {appHasOAuthClient && <AppAuthenticationSection app={app} />}

          <AppApiKeysSection app={app} />

          {isLoadingSubscriptions || subscriptions === undefined ? (
            <Loader />
          ) : (
            <AppApiSubscriptionsSection
              app={app}
              subscriptions={!Array.isArray(subscriptions) ? [] : subscriptions}
            />
          )}
        </Flex>
      </Box>
    </PageContainer>
  );
};
