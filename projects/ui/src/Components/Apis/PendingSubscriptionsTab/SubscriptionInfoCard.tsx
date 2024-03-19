import { Box, Flex } from "@mantine/core";
import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { NavLink } from "react-router-dom";
import { Subscription } from "../../../Apis/api-types";
import {
  useListApiProducts,
  useListAppsForTeams,
  useListTeams,
} from "../../../Apis/hooks";
import { AppIcon } from "../../../Assets/Icons/Icons";
import { CardStyles } from "../../../Styles/shared/Card.style";
import { UtilityStyles } from "../../../Styles/shared/Utility.style";
import {
  getApiProductDetailsDocsTabLink,
  getApiProductDetailsSpecTabLink,
} from "../../../Utility/link-builders";
import { SubscriptionState } from "../ApisPage";
import { SubscriptionInfoCardStyles as Styles } from "./SubscriptionInfoCard.style";

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

  const subscribedApiProduct = useMemo(() => {
    return apiProductsList?.find(
      (apiProduct) => apiProduct.id === subscription.apiProductId
    );
  }, [apiProductsList, subscription]);

  const appThatSubscribed = useMemo(() => {
    return apps?.find((app) => app.id === subscription.applicationId);
  }, [apps, subscription]);

  return (
    // <Styles.Card subscriptionState={subscription.state}>
    // <Styles.Card subscriptionState={SubscriptionState.REJECTED}>
    <Styles.Card subscriptionState={SubscriptionState.PENDING}>
      <Styles.Content>
        <Flex justify="space-between">
          <CardStyles.TitleMedium bold>
            {subscribedApiProduct?.name ?? "API Product Not Found"}
          </CardStyles.TitleMedium>
          {/* <Styles.SubscriptionCardBadge subscriptionState={subscription.state}>
            {subscriptionStateMap[subscription.state].label}
          </Styles.SubscriptionCardBadge> */}
        </Flex>
        <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
          <AppIcon width={20} />
          <CardStyles.SmallerText>
            {appThatSubscribed?.name ?? "App Not Found"}
          </CardStyles.SmallerText>
        </Flex>
      </Styles.Content>
      {subscribedApiProduct && (
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
      )}
      {/* // TODO: Add cancel button (with cancel subscription modal) here. */}
    </Styles.Card>
  );
};

export default SubscriptionInfoCard;
