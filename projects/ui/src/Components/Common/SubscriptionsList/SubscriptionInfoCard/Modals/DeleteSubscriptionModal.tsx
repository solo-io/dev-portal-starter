import { Box, Button, CloseButton, Flex, Text } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { Subscription } from "../../../../../Apis/api-types";
import { useAdminDeleteSubscriptionMutation } from "../../../../../Apis/hooks";
import { FormModalStyles } from "../../../../../Styles/shared/FormModalStyles";

const DeleteSubscriptionModal = ({
  subscription,
  open,
  onClose,
}: {
  subscription: Subscription;
  open: boolean;
  onClose: () => void;
}) => {
  di(useAdminDeleteSubscriptionMutation);
  const { trigger: deleteSub } = useAdminDeleteSubscriptionMutation();
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
          <Button color="gray.5" onClick={onClose} type="button">
            <Text color="gray.9">Cancel</Text>
          </Button>
          <Button color="red" onClick={onConfirm} type="submit">
            <Text color="red.0">Delete Subscription</Text>
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default DeleteSubscriptionModal;
