import { Box, CloseButton, Flex } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { Subscription } from "../../../../../Apis/api-types";
import { useDeleteSubscriptionMutation } from "../../../../../Apis/hooks";
import { FormModalStyles } from "../../../../../Styles/shared/FormModalStyles";
import { Button } from "../../../Button";

const DeleteSubscriptionModal = ({
  subscription,
  open,
  onClose,
}: {
  subscription: Subscription;
  open: boolean;
  onClose: () => void;
}) => {
  di(useDeleteSubscriptionMutation);
  const { trigger: deleteSub } = useDeleteSubscriptionMutation();
  const onConfirm = async (e?: FormEvent) => {
    e?.preventDefault();
    await toast.promise(deleteSub({ subscription }), {
      error: (e) => "There was an error deleting the subscription. " + e,
      loading: "Deleting the subscription...",
      success: "Deleted the subscription!",
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
          <FormModalStyles.Title>Delete Subscription</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to delete this subscription?
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
          <Button color="danger" onClick={onConfirm} type="submit">
            Delete Subscription
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default DeleteSubscriptionModal;
