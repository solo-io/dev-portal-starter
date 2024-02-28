import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { NavLink } from "react-router-dom";
import { useListApis } from "../../../Apis/hooks";
import { Subscription, SubscriptionState } from "../ApisPage";
import { getApiDetailsLink } from "../helpers";

namespace SubscriptionInfoCardStyles {
  export const Card = styled.div(
    ({ theme }) => css`
      width: 350px;
      padding: 10px;
      //
      border: 1px solid ${theme.dropBlue};
      background-color: white;
      border-radius: 5px;
      box-shadow: 1px 1px 5px ${theme.augustGrey};
    `
  );

  export const CardTitle = styled.div(
    ({ theme }) => css`
      font-size: 1.5rem;
      //
    `
  );
}

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
    <SubscriptionInfoCardStyles.Card>
      <SubscriptionInfoCardStyles.CardTitle>
        {subscription.subscriptionName}
      </SubscriptionInfoCardStyles.CardTitle>
      {subscription.usagePlanName}
      <br />
      {subscription.appName}
      <br />
      {subscription.state === SubscriptionState.PENDING
        ? "pending"
        : "accepted"}
      <br />
      {subscribedApi && (
        <NavLink to={getApiDetailsLink(subscribedApi)}>Spec</NavLink>
      )}

      {/* <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          {subscription.subscriptionName}
        </Card.Section>
      </Card> */}
    </SubscriptionInfoCardStyles.Card>
  );
};

export default SubscriptionInfoCard;
