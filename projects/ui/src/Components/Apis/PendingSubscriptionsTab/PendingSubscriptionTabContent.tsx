import { Flex } from "@mantine/core";
import { Subscription } from "../../../Apis/api-types";
import { EmptyData } from "../../Common/EmptyData";
import SubscriptionInfoCard from "./SubscriptionInfoCard";

const PendingSubscriptionTabContent = ({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) => {
  return (
    <Flex gap={30} wrap={"wrap"}>
      {subscriptions.length === 0 ? (
        <EmptyData topic="pending API subscription" />
      ) : (
        subscriptions.map((s) => (
          <SubscriptionInfoCard key={s.id} subscription={s} />
        ))
      )}
    </Flex>
  );
};

export default PendingSubscriptionTabContent;
