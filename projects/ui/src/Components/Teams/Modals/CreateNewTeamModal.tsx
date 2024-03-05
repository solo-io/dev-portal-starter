import { CloseButton, Flex, Input } from "@mantine/core";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useCreateTeamMutation } from "../../../Apis/hooks";
import { FormModalStyles } from "../../../Styles/shared/FormModalStyles";
import { Button } from "../../Common/Button";

const CreateNewTeamModal = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  const { trigger: createTeam } = useCreateTeamMutation();

  const onSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    toast.promise(
      createTeam({ name: teamName, description: teamDescription }),
      {
        error: "There was an error creating the team.",
        loading: "Creating the team...",
        success: "Created the team!",
      }
    );
  };

  return (
    <FormModalStyles.CustomModal
      onClose={onClose}
      opened={opened}
      size={"800px"}
    >
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Create a New Team</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Create a new team.
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <FormModalStyles.BodyContainerForm onSubmit={onSubmit}>
        <FormModalStyles.InputContainer>
          <label htmlFor="team-name-input">Team Name</label>
          <Input
            id="team-name-input"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </FormModalStyles.InputContainer>
        <FormModalStyles.InputContainer>
          <label htmlFor="team-description-input">Team Description</label>
          <Input
            // This could be a Textarea if newlines exist in the description.
            // Then we would need to get the text content using a ref
            // so that newlines are preserved when saved.
            // <Textarea
            id="team-description-input"
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
          />
        </FormModalStyles.InputContainer>
        <Flex justify={"flex-end"} gap="20px">
          <Button className="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} type="submit">
            Create Team
          </Button>
        </Flex>
      </FormModalStyles.BodyContainerForm>
    </FormModalStyles.CustomModal>
  );
};

export default CreateNewTeamModal;
