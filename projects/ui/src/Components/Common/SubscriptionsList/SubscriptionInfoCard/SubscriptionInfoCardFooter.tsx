import { Box, Flex } from "@mantine/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Subscription } from "../../../../Apis/api-types";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import {
  getApiProductDetailsDocsTabLink,
  getApiProductDetailsSpecTabLink,
} from "../../../../Utility/link-builders";
import { Button } from "../../Button";
import { SubscriptionState } from "../SubscriptionsUtility";
import DeleteSubscriptionModal from "./Modals/DeleteSubscriptionModal";
import { SubscriptionInfoCardStyles } from "./SubscriptionInfoCard.style";

const SubscriptionInfoCardFooter = ({
  subscribedApiProductId,
  subscription,
  subscriptionState,
}: {
  subscribedApiProductId: string;
  subscription: Subscription;
  subscriptionState: SubscriptionState;
}) => {
  const [showDeleteSubModal, setShowDeleteSubModal] = useState(false);
  const canDeleteSubscription = true;
  // We could limit what's able to be deleted like this.
  // But it's possible that an admin accidentally rejects a subscription and a user wants to recreate it.
  // const canDeleteSubscription =
  //   subscriptionState === SubscriptionState.PENDING ||
  //   subscriptionState === SubscriptionState.APPROVED;

  //
  // Render
  //
  return (
    <>
      <SubscriptionInfoCardStyles.Footer>
        <Flex gap="inherit" justify={"space-between"} sx={{ width: "100%" }}>
          <Flex gap="inherit">
            <UtilityStyles.NavLinkContainer>
              <NavLink
                to={getApiProductDetailsSpecTabLink(subscribedApiProductId)}
              >
                SPEC
              </NavLink>
            </UtilityStyles.NavLinkContainer>
            <Box>|</Box>
            <UtilityStyles.NavLinkContainer>
              <NavLink
                to={getApiProductDetailsDocsTabLink(subscribedApiProductId)}
              >
                DOCS
              </NavLink>
            </UtilityStyles.NavLinkContainer>
          </Flex>
          <Button
            color="danger"
            size="xs"
            disabled={!canDeleteSubscription}
            onClick={() => setShowDeleteSubModal(true)}
          >
            Delete
          </Button>
        </Flex>
      </SubscriptionInfoCardStyles.Footer>
      <DeleteSubscriptionModal
        subscription={subscription}
        open={showDeleteSubModal}
        onClose={() => setShowDeleteSubModal(false)}
      />
    </>
  );
};

export default SubscriptionInfoCardFooter;
