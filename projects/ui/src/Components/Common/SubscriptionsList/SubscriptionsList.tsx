import { Box, Flex, Loader } from "@mantine/core";
import { ErrorMessageResponse, Subscription } from "../../../Apis/api-types";
import { colors } from "../../../Styles";
import { AdminSubscriptionsFiltrationProp } from "../../AdminSubscriptions/AdminSubscriptionsFilter";
import { EmptyData } from "../../Common/EmptyData";
import SubscriptionInfoCard from "./SubscriptionInfoCard/SubscriptionInfoCard";

const SubscriptionsList = ({
  isLoadingSubscriptions,
  subscriptions,
  filters,
}: {
  isLoadingSubscriptions: boolean;
  subscriptions: Subscription[] | ErrorMessageResponse | undefined;
  filters?: AdminSubscriptionsFiltrationProp;
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
    <Box pb={"60px"}>
      <Flex gap={"20px"} wrap={"wrap"}>
        {subscriptions.map((s) => (
          <SubscriptionInfoCard key={s.id} subscription={s} filters={filters} />
        ))}
      </Flex>
    </Box>
  );
};

export default SubscriptionsList;
