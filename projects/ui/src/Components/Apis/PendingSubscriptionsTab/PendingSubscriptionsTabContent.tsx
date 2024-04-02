import { Subscription } from "../../../Apis/api-types";
import SubscriptionsList from "../../Common/SubscriptionsList/SubscriptionsList";

const PendingSubscriptionsTabContent = ({
  subscriptions,
  isLoadingSubscriptions,
}: {
  subscriptions: Subscription[] | undefined;
  isLoadingSubscriptions: boolean;
}) => {
  return (
    <SubscriptionsList
      subscriptions={subscriptions}
      isLoadingSubscriptions={isLoadingSubscriptions}
    />
  );
};

export default PendingSubscriptionsTabContent;
