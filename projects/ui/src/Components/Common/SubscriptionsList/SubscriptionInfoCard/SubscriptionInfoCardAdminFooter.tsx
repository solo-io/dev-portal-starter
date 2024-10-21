import { Box, Flex } from "@mantine/core";
import { useState } from "react";
import { Subscription } from "../../../../Apis/api-types";
import { Button } from "../../Button";
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
              color="success"
              size="xs"
              disabled={subscriptionState === SubscriptionState.APPROVED}
              onClick={() => setShowApproveSubModal(true)}
            >
              Approve
            </Button>

            <Button
              color="warning"
              size="xs"
              disabled={subscriptionState === SubscriptionState.REJECTED}
              onClick={() => setShowRejectSubModal(true)}
            >
              Reject
            </Button>

            <Button
              color="danger"
              size="xs"
              disabled={!canDeleteSubscription}
              onClick={() => setShowDeleteSubModal(true)}
            >
              Delete
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
