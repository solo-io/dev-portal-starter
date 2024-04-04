import { Box, Button, CloseButton, Flex, Text } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useRemoveTeamMemberMutation } from "../../../../Apis/hooks";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";

const ConfirmRemoveTeamMemberModal = ({
  userId,
  teamId,
  open,
  onClose,
}: {
  userId: string;
  teamId: string;
  open: boolean;
  onClose: () => void;
}) => {
  di(useRemoveTeamMemberMutation);
  const { trigger: removeTeamMember } = useRemoveTeamMemberMutation();
  const onConfirm = async (e?: FormEvent) => {
    e?.preventDefault();
    await toast.promise(removeTeamMember({ userId, teamId }), {
      error: (e) => "There was an error removing the user. " + e,
      loading: "Removing the user...",
      success: "Removed the user!",
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
          <FormModalStyles.Title>Remove User</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to remove this user from the team?
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
            <Text color="red.0">Remove User</Text>
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default ConfirmRemoveTeamMemberModal;
