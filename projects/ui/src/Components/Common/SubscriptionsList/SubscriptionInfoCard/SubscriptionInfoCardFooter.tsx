import { Box, Button, Flex, Text } from "@mantine/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Subscription } from "../../../../Apis/api-types";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import {
  getApiProductDetailsDocsTabLink,
  getApiProductDetailsSpecTabLink,
} from "../../../../Utility/link-builders";
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
  const canDeleteSubscription =
    subscriptionState === SubscriptionState.PENDING ||
    subscriptionState === SubscriptionState.ACCEPTED;

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
