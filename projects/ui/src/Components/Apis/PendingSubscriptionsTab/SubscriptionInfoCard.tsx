import { Box, Flex } from "@mantine/core";
import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { NavLink } from "react-router-dom";
import { Subscription } from "../../../Apis/api-types";
import { useListApis } from "../../../Apis/hooks";
import { AppIcon } from "../../../Assets/Icons/Icons";
import { CardStyles } from "../../../Styles/shared/Card.style";
import { getApiDetailsLink } from "../../../Utility/link-builders";
import { SubscriptionState } from "../ApisPage";
import { SubscriptionInfoCardStyles as Styles } from "./SubscriptionInfoCard.style";

const SubscriptionInfoCard = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  di(useListApis);
  const { data: apisList } = useListApis();

  const subscribedApi = useMemo(() => {
    return apisList?.find(
      (api) => api.apiProductId === subscription.apiProductId
    );
  }, [apisList, subscription]);

  return (
    // <Styles.Card subscriptionState={subscription.state}>
    <Styles.Card subscriptionState={SubscriptionState.REJECTED}>
      <Styles.Content>
        <Flex justify="space-between">
          {/* <Styles.CardTitle>{subscription.subscriptionName}</Styles.CardTitle> */}
          <Styles.CardTitle>{subscription.id}</Styles.CardTitle>
          {/* <Styles.SubscriptionCardBadge subscriptionState={subscription.state}>
            {subscriptionStateMap[subscription.state].label}
          </Styles.SubscriptionCardBadge> */}
        </Flex>
        <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
          <AppIcon width={20} />
          <CardStyles.SmallerText>
            {/* {subscription.appName} */}
            {subscription.id}
          </CardStyles.SmallerText>
        </Flex>
        <CardStyles.SmallerText>
          {/* {subscription.usagePlanName} */}
          {subscription.id}
        </CardStyles.SmallerText>
      </Styles.Content>
      {subscribedApi && (
        <Styles.Footer>
          <NavLink to={getApiDetailsLink(subscribedApi)}>SPEC</NavLink>
          <Box>|</Box>
          {/* // TODO: Update links to go to docs tab on api details page when we can specify that. */}
          <NavLink to={getApiDetailsLink(subscribedApi)}>DOCS</NavLink>
        </Styles.Footer>
      )}
      {/* // TODO: Add cancel button (with cancel subscription modal) here. */}
    </Styles.Card>
  );
};

export default SubscriptionInfoCard;
