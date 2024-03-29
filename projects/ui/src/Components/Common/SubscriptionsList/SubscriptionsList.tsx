import { Box, Flex, Loader } from "@mantine/core";
import { ErrorMessageResponse, Subscription } from "../../../Apis/api-types";
import { colors } from "../../../Styles";
import { EmptyData } from "../../Common/EmptyData";
import SubscriptionInfoCard from "./SubscriptionInfoCard";

const SubscriptionsList = ({
  isLoadingSubscriptions,
  subscriptions,
}: {
  isLoadingSubscriptions: boolean;
  subscriptions: Subscription[] | ErrorMessageResponse | undefined;
}) => {
  const subscriptionsError = subscriptions && "message" in subscriptions;

  //
  // Render
  //
  if (isLoadingSubscriptions || !subscriptions) {
    return (
      <Box pl={5} mb={-10}>
        <Loader size={"20px"} color={colors.seaBlue} />
      </Box>
    );
  }
  if (subscriptionsError) {
    return null;
  }
  if (subscriptions.length === 0) {
    return <EmptyData topic="API subscriptions" />;
  }
  return (
    <Flex gap={30} wrap={"wrap"}>
      {subscriptions.map((s) => (
        <SubscriptionInfoCard key={s.id} subscription={s} />
      ))}
    </Flex>
  );
};

export default SubscriptionsList;
