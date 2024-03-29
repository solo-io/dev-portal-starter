import { Box, Flex } from "@mantine/core";
import { useContext, useMemo } from "react";
import { di } from "react-magnetic-di";
import { NavLink } from "react-router-dom";
import { Subscription } from "../../../../Apis/api-types";
import {
  useListApiProducts,
  useListAppsForTeams,
  useListTeams,
} from "../../../../Apis/hooks";
import { Icon } from "../../../../Assets/Icons";
import { PortalAuthContext } from "../../../../Context/PortalAuthContext";
import { CardStyles } from "../../../../Styles/shared/Card.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import {
  getApiProductDetailsDocsTabLink,
  getApiProductDetailsSpecTabLink,
} from "../../../../Utility/link-builders";
import {
  GetSubscriptionState,
  subscriptionStateMap,
} from "../SubscriptionsUtility";
import { SubscriptionInfoCardStyles as Styles } from "./SubscriptionInfoCard.style";
import SubscriptionInfoCardAdminFooter from "./SubscriptionInfoCardAdminFooter";

const SubscriptionInfoCard = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  di(useListTeams, useListAppsForTeams);
  const { data: apiProductsList } = useListApiProducts();
  const { data: teams } = useListTeams();
  const { data: appsForTeams } = useListAppsForTeams(teams ?? []);
  const apps = useMemo(() => appsForTeams?.flat(), [appsForTeams]);

  const { isAdmin } = useContext(PortalAuthContext);

  const subscribedApiProduct = useMemo(() => {
    return apiProductsList?.find(
      (apiProduct) => apiProduct.id === subscription.apiProductId
    );
  }, [apiProductsList, subscription]);

  const appThatSubscribed = useMemo(() => {
    return apps?.find((app) => app.id === subscription.applicationId);
  }, [apps, subscription]);

  const teamOfAppThatSubscribed = useMemo(() => {
    return teams?.find((team) => team.id === appThatSubscribed?.teamId);
  }, [teams, appThatSubscribed]);

  const subscriptionState = useMemo(
    () => GetSubscriptionState(subscription),
    [subscription]
  );
  const subscriptionStateInfo = subscriptionStateMap[subscriptionState];

  //
  // Render
  //
  return (
    <Styles.Card subscriptionState={subscriptionState}>
      <Styles.Content>
        <Flex justify="space-between">
          <CardStyles.TitleMedium bold>
            {subscribedApiProduct?.name ?? "API Product Not Found"}
          </CardStyles.TitleMedium>
          <Styles.SubscriptionCardBadge subscriptionState={subscriptionState}>
            {subscriptionStateInfo.label}
          </Styles.SubscriptionCardBadge>
        </Flex>
        <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
          <Icon.AppIcon width={20} />
          <CardStyles.SmallerText>
            {appThatSubscribed?.name ?? "App Not Found"}
          </CardStyles.SmallerText>
        </Flex>
        <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
          <Icon.TeamsIcon width={20} />
          <CardStyles.SmallerText>
            {teamOfAppThatSubscribed?.name ?? "Team Not Found"}
          </CardStyles.SmallerText>
        </Flex>
      </Styles.Content>
      {isAdmin ? (
        <SubscriptionInfoCardAdminFooter
          subscription={subscription}
          subscriptionState={subscriptionState}
        />
      ) : (
        subscribedApiProduct && (
          <Styles.Footer>
            <UtilityStyles.NavLinkContainer>
              <NavLink
                to={getApiProductDetailsSpecTabLink(subscribedApiProduct.id)}
              >
                SPEC
              </NavLink>
            </UtilityStyles.NavLinkContainer>
            <Box>|</Box>
            <UtilityStyles.NavLinkContainer>
              <NavLink
                to={getApiProductDetailsDocsTabLink(subscribedApiProduct.id)}
              >
                DOCS
              </NavLink>
            </UtilityStyles.NavLinkContainer>
          </Styles.Footer>
        )
      )}
    </Styles.Card>
  );
};

export default SubscriptionInfoCard;
