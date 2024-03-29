import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Flex } from "@mantine/core";
import { borderRadiusConstants } from "../../../Styles/constants";
import {
  SubscriptionState,
  subscriptionStateMap,
} from "./SubscriptionsUtility";

export namespace SubscriptionInfoCardStyles {
  export const Card = styled.div<{
    subscriptionState: SubscriptionState;
  }>(
    ({ theme, subscriptionState }) => css`
      width: 422px;
      border: 1px solid ${subscriptionStateMap[subscriptionState].borderColor};
      border-radius: ${borderRadiusConstants.small};
      background-color: white;
      box-shadow: 1px 1px 5px ${theme.splashBlue};
    `
  );

  export const Content = styled(Flex)`
    flex-direction: column;
    gap: 10px;
    padding: 20px 20px 15px 20px;
    background-color: white;
    border-top-right-radius: inherit;
    border-top-left-radius: inherit;
  `;

  export const Footer = styled(Flex)(
    ({ theme }) => css`
      padding: 6px 20px;
      background-color: ${theme.splashBlueLight7};
      color: ${theme.septemberGrey};
      border-bottom-right-radius: inherit;
      border-bottom-left-radius: inherit;
      font-size: 0.95rem;
      gap: 10px;
    `
  );

  export const SubscriptionCardBadge = styled.div<{
    subscriptionState: SubscriptionState;
  }>(
    ({ subscriptionState }) => css`
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: bold;
      color: white;
      background-color: ${subscriptionStateMap[subscriptionState].accentColor};
      padding: 0px 10px;
      font-weight: normal;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    `
  );
}
