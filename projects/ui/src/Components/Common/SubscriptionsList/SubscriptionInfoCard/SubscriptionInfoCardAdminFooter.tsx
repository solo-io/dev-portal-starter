import { Box, Button, Flex, Text } from "@mantine/core";
import { useState } from "react";
import { Subscription } from "../../../../Apis/api-types";
import { SubscriptionState } from "../SubscriptionsUtility";
import ApproveSubscriptionModal from "./Modals/ApproveSubscriptionModal";
import DeleteSubscriptionModal from "./Modals/DeleteSubscriptionModal";
import RejectSubscriptionModal from "./Modals/RejectSubscriptionModal";
import { SubscriptionInfoCardStyles as Styles } from "./SubscriptionInfoCard.style";

const SubscriptionInfoCardAdminFooter = ({
  subscription,
  subscriptionState,
}: {
  subscription: Subscription;
  subscriptionState: SubscriptionState;
}) => {
  const [showApproveSubModal, setShowApproveSubModal] = useState(false);
  const [showRejectSubModal, setShowRejectSubModal] = useState(false);
  const [showDeleteSubModal, setShowDeleteSubModal] = useState(false);

  const canApproveRejectSubscription =
    subscriptionState === SubscriptionState.PENDING;
  const canDeleteSubscription = subscriptionState !== SubscriptionState.DELETED;

  //
  // Render
  //
  return (
    <>
      <Styles.Footer>
        <Box py="5px">
          <Flex gap="15px" wrap={"wrap"}>
            <Button
              color="green"
              size="xs"
              disabled={!canApproveRejectSubscription}
              onClick={() => setShowApproveSubModal(true)}
            >
              <Text color="green.0" weight={500}>
                Approve
              </Text>
            </Button>

            <Button
              color="yellow"
              size="xs"
              disabled={!canApproveRejectSubscription}
              onClick={() => setShowRejectSubModal(true)}
            >
              <Text color="red.6" weight={500}>
                Reject
              </Text>
            </Button>

            <Button
              color="red"
              size="xs"
              disabled={!canDeleteSubscription}
              onClick={() => setShowDeleteSubModal(true)}
            >
              <Text color="red.0" weight={500}>
                Delete
              </Text>
            </Button>
          </Flex>
        </Box>
      </Styles.Footer>
      <ApproveSubscriptionModal
        subscription={subscription}
        open={showApproveSubModal}
        onClose={() => setShowApproveSubModal(false)}
      />
      <RejectSubscriptionModal
        subscription={subscription}
        open={showRejectSubModal}
        onClose={() => setShowRejectSubModal(false)}
      />
      <DeleteSubscriptionModal
        subscription={subscription}
        open={showDeleteSubModal}
        onClose={() => setShowDeleteSubModal(false)}
      />
    </>
  );
};

export default SubscriptionInfoCardAdminFooter;
