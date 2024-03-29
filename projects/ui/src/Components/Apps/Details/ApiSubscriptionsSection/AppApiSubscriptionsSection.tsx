import { Box, Button, Flex } from "@mantine/core";
import { useMemo, useState } from "react";
import { App, Subscription } from "../../../../Apis/api-types";
import { Icon } from "../../../../Assets/Icons";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { EmptyData } from "../../../Common/EmptyData";
import SubscriptionInfoCard from "../../../Common/SubscriptionsList/SubscriptionInfoCard";
import NewSubscriptionModal from "../Modals/NewSubscriptionModal";

const AddSubscriptionButton = (props: typeof Button.defaultProps) => {
  return (
    <Button {...props} variant="subtle">
      <UtilityStyles.ButtonContentsWithIcon>
        ADD SUBSCRIPTION
        <Icon.PlusIcon />
      </UtilityStyles.ButtonContentsWithIcon>
    </Button>
  );
};

const AppApiSubscriptionsSection = ({
  app,
  subscriptions,
}: {
  app: App;
  subscriptions: Subscription[];
}) => {
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] =
    useState(false);

  const appSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => s.applicationId === app.id);
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
      <Box pt={"5px"}>
        <Flex wrap="wrap" gap={"20px"}>
          {appSubscriptions.map((s) => (
            <SubscriptionInfoCard key={s.id} subscription={s} />
          ))}
        </Flex>
      </Box>
      <NewSubscriptionModal
        app={app}
        opened={showAddSubscriptionModal}
        onClose={() => setShowAddSubscriptionModal(false)}
      />
    </DetailsPageStyles.Section>
  );
};

export default AppApiSubscriptionsSection;
