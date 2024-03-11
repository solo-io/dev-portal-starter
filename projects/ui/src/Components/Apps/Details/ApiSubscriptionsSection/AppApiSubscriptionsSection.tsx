import { Box, Button, Flex } from "@mantine/core";
import { useMemo, useState } from "react";
import { App, Subscription } from "../../../../Apis/api-types";
import { Icon } from "../../../../Assets/Icons";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import SubscriptionInfoCard from "../../../Apis/PendingSubscriptionsTab/SubscriptionInfoCard";
import { EmptyData } from "../../../Common/EmptyData";
import NewSubscriptionModal from "../Modals/NewSubscriptionModal";

const AddSubscriptionButton = (props: typeof Button.defaultProps) => {
  return (
    <Button {...props} variant="subtle">
      <UtilityStyles.StyledButtonContentsWithIcon>
        ADD SUBSCRIPTION
        <Icon.PlusIcon />
      </UtilityStyles.StyledButtonContentsWithIcon>
    </Button>
  );
};

const AppSubscriptionsSection = ({
  app,
  subscriptions,
}: {
  app: App;
  subscriptions: Subscription[];
}) => {
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] =
    useState(false);

  const appSubscriptions = useMemo(() => {
    return subscriptions?.filter((s) => s.applicationId === app.id);
  }, [subscriptions, app]);

  return (
    <DetailsPageStyles.Section>
      <Flex justify={"space-between"}>
        <DetailsPageStyles.Title>API Subscriptions</DetailsPageStyles.Title>
        <AddSubscriptionButton
          onClick={() => setShowAddSubscriptionModal(true)}
        />
      </Flex>
      {subscriptions.length === 0 && (
        <Box pt="30px">
          <EmptyData topic={"API Subscription"} />
        </Box>
      )}
      <Flex wrap="wrap" gap={"20px"}>
        {appSubscriptions.map((s) => (
          <SubscriptionInfoCard subscription={s} />
        ))}
      </Flex>
      <NewSubscriptionModal
        app={app}
        opened={showAddSubscriptionModal}
        onClose={() => setShowAddSubscriptionModal(false)}
      />
    </DetailsPageStyles.Section>
  );
};

export default AppSubscriptionsSection;
