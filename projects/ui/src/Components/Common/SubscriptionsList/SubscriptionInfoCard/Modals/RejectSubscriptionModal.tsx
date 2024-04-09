import { Box, CloseButton, Flex } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { Subscription } from "../../../../../Apis/api-types";
import { useAdminRejectSubscriptionMutation } from "../../../../../Apis/hooks";
import { FormModalStyles } from "../../../../../Styles/shared/FormModalStyles";
import { Button } from "../../../Button";

const RejectSubscriptionModal = ({
  subscription,
  open,
  onClose,
}: {
  subscription: Subscription;
  open: boolean;
  onClose: () => void;
}) => {
  di(useAdminRejectSubscriptionMutation);
  const { trigger: rejectSub } = useAdminRejectSubscriptionMutation();
  const onConfirm = async (e?: FormEvent) => {
    e?.preventDefault();
    await toast.promise(rejectSub({ subscription }), {
      error: (e) => "There was an error rejecting the subscription. " + e,
      loading: "Rejecting the subscription...",
      success: "Rejected the subscription!",
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
          <FormModalStyles.Title>Reject Subscription</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to reject this subscription?
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <Box p="20px 30px 40px 30px">
        <Flex justify={"flex-end"} gap="20px">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button color="warning" onClick={onConfirm} type="submit">
            Reject Subscription
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default RejectSubscriptionModal;
