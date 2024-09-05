import { Subscription } from "../../../Apis/api-types";
import { colors } from "../../../Styles";

export enum SubscriptionState {
  PENDING,
  APPROVED,
  REJECTED,
  DELETED,
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
  [SubscriptionState.DELETED]: {
    subscriptionState: SubscriptionState.DELETED,
    label: "DELETED",
    accentColor: colors.aprilGrey,
    borderColor: colors.aprilGrey,
  },
};

const dateHasValue = (dateString: string | undefined) => {
  return !!dateString && new Date(dateString).getFullYear() !== 0;
};

export const GetSubscriptionState = (subscription: Subscription) => {
  if (!!subscription.approved) {
    return SubscriptionState.APPROVED;
  }
  if (dateHasValue(subscription.deletedAt)) {
    return SubscriptionState.DELETED;
  }
  if (!!subscription.rejected) {
    return SubscriptionState.REJECTED;
  }
  return SubscriptionState.PENDING;
};
