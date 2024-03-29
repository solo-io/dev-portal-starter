import { Subscription } from "../../../Apis/api-types";
import { colors } from "../../../Styles";

export enum SubscriptionState {
  PENDING,
  ACCEPTED,
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
  [SubscriptionState.ACCEPTED]: {
    subscriptionState: SubscriptionState.ACCEPTED,
    label: "ACCEPTED",
    accentColor: colors.midGreen,
    borderColor: colors.splashBlue,
  },
  [SubscriptionState.REJECTED]: {
    subscriptionState: SubscriptionState.REJECTED,
    label: "REJECTED",
    accentColor: colors.darkRed,
    borderColor: colors.pumpkinOrange,
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
    return SubscriptionState.ACCEPTED;
  }
  if (dateHasValue(subscription.deletedAt)) {
    return SubscriptionState.DELETED;
  }
  if (!!subscription.rejected) {
    return SubscriptionState.REJECTED;
  }
  return SubscriptionState.PENDING;
};
