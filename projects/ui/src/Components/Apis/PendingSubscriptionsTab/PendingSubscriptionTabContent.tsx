import { Flex } from "@mantine/core";
import { Subscription } from "../ApisPage";
import SubscriptionInfoCard from "./SubscriptionInfoCard";

const PendingSubscriptionTabContent = ({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) => {
  return (
    <Flex gap={30} wrap={"wrap"}>
      {subscriptions.map((s) => (
        <SubscriptionInfoCard key={s.subscriptionName} subscription={s} />
      ))}
    </Flex>
  );
};

export default PendingSubscriptionTabContent;
