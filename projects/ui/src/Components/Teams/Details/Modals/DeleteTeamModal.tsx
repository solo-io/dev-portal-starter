import { Box, Button, CloseButton, Flex, Text } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useNavigate } from "react-router-dom";
import { Team } from "../../../../Apis/api-types";
import { useDeleteTeamMutation } from "../../../../Apis/hooks";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";

const DeleteTeamModal = ({
  team,
  open,
  onClose,
}: {
  team: Team;
  open: boolean;
  onClose: () => void;
}) => {
  di(useDeleteTeamMutation);
  const navigate = useNavigate();
  const { trigger: deleteTeam } = useDeleteTeamMutation();
  const onConfirm = async (e?: FormEvent) => {
    e?.preventDefault();
    await toast.promise(deleteTeam({ teamId: team.id }), {
      error: (e) => "There was an error deleting the team. " + e,
      loading: "Deleting the team...",
      success: "Deleted the team!",
    });
    onClose();
    navigate("/");
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal onClose={onClose} opened={open} size={"600px"}>
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Delete Team</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to delete this team?
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <Box p="20px 30px 40px 30px">
        <Flex justify={"flex-end"} gap="20px">
          <Button color="gray.4" onClick={onClose} type="button">
            <Text color="gray.9">Cancel</Text>
          </Button>
          <Button color="red" onClick={onConfirm} type="submit">
            <Text color="red.0">Delete Team</Text>
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default DeleteTeamModal;
