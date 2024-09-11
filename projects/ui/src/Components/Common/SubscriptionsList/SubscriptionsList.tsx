import { Box, Flex, Loader } from "@mantine/core";
import {
  Subscription,
  SubscriptionsListError,
  isSubscriptionsListError,
} from "../../../Apis/api-types";
import { colors } from "../../../Styles";
import { EmptyData } from "../../Common/EmptyData";
import { FiltrationProp } from "../Filters/AppliedFiltersSection";
import SubscriptionInfoCard from "./SubscriptionInfoCard/SubscriptionInfoCard";

const SubscriptionsList = ({
  isLoadingSubscriptions,
  subscriptions,
  filters,
}: {
  isLoadingSubscriptions: boolean;
  subscriptions: Subscription[] | SubscriptionsListError | undefined;
  filters?: FiltrationProp;
}) => {
  const subscriptionsError =
    !Array.isArray(subscriptions) || isSubscriptionsListError(subscriptions);

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
    return <EmptyData title="No Subscriptions were found." />;
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
