import { Flex } from "@mantine/core";
import { Subscription } from "../../../Apis/api-types";
import SubscriptionInfoCard from "./SubscriptionInfoCard";

const PendingSubscriptionTabContent = ({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) => {
  return (
    <Flex gap={30} wrap={"wrap"}>
      {subscriptions.map((s) => (
        <SubscriptionInfoCard key={s.id} subscription={s} />
      ))}
    </Flex>
  );
};

export default PendingSubscriptionTabContent;
