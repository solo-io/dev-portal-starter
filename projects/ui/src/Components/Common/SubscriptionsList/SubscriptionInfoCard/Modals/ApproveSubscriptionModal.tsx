import { Box, Button, CloseButton, Flex, Text } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { Subscription } from "../../../../../Apis/api-types";
import { useAdminApproveSubscriptionMutation } from "../../../../../Apis/hooks";
import { FormModalStyles } from "../../../../../Styles/shared/FormModalStyles";

const ApproveSubscriptionModal = ({
  subscription,
  open,
  onClose,
}: {
  subscription: Subscription;
  open: boolean;
  onClose: () => void;
}) => {
  di(useAdminApproveSubscriptionMutation);
  const { trigger: approveSub } = useAdminApproveSubscriptionMutation();
  const onConfirm = async (e?: FormEvent) => {
    e?.preventDefault();
    await toast.promise(approveSub({ subscriptionId: subscription.id }), {
      error: "There was an error approving the subscription.",
      loading: "Approving the subscription...",
      success: "Approved the subscription!",
    });
    onClose();
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal onClose={onClose} opened={open} size={"600px"}>
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Approve Subscription</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to approve this subscription?
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <Box p="20px 30px 40px 30px">
        <Flex justify={"flex-end"} gap="20px">
          <Button color="gray" onClick={onClose} type="button">
            <Text color="gray.9">Cancel</Text>
          </Button>
          <Button color="green" onClick={onConfirm} type="submit">
            <Text color="green.0">Approve Subscription</Text>
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default ApproveSubscriptionModal;
