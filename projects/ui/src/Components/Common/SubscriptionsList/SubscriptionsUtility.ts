import { Subscription } from "../../../Apis/api-types";
import { colors } from "../../../Styles";

export enum SubscriptionState {
  PENDING,
  APPROVED,
  REJECTED,
}
export const subscriptionStateMap = {
  [SubscriptionState.PENDING]: {
    subscriptionState: SubscriptionState.PENDING,
    label: "PENDING",
    accentColor: colors.seaBlue,
    borderColor: colors.splashBlue,
  },
  [SubscriptionState.APPROVED]: {
    subscriptionState: SubscriptionState.APPROVED,
    label: "APPROVED",
    accentColor: colors.midGreen,
    borderColor: colors.splashBlue,
  },
  [SubscriptionState.REJECTED]: {
    subscriptionState: SubscriptionState.REJECTED,
    label: "REJECTED",
    accentColor: colors.darkRed,
    borderColor: colors.lightMidRed,
  },
};

export const GetSubscriptionState = (subscription: Subscription) => {
  if (!!subscription.approved) {
    return SubscriptionState.APPROVED;
  }
  if (!!subscription.rejected) {
    return SubscriptionState.REJECTED;
  }
  // Deleted subscriptions aren't returned from the API.
  return SubscriptionState.PENDING;
};
