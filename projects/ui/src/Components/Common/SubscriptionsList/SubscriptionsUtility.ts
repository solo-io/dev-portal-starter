import { colors } from "../../../Styles";

export enum SubscriptionState {
  PENDING,
  ACCEPTED,
  REJECTED,
}
export const subscriptionStateMap = {
  [SubscriptionState.PENDING]: {
    label: "PENDING",
    accentColor: colors.seaBlue,
    borderColor: colors.splashBlue,
  },
  [SubscriptionState.ACCEPTED]: {
    label: "ACCEPTED",
    accentColor: colors.midGreen,
    borderColor: colors.splashBlue,
  },
  [SubscriptionState.REJECTED]: {
    label: "REJECTED",
    accentColor: colors.darkRed,
    borderColor: colors.pumpkinOrange,
  },
};
