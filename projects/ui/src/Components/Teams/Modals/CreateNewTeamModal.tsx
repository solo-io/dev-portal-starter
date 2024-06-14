import { CloseButton, Flex, Input } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useCreateTeamMutation } from "../../../Apis/gg_hooks";
import { FormModalStyles } from "../../../Styles/shared/FormModalStyles";
import { Button } from "../../Common/Button";

const CreateNewTeamModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  di(useCreateTeamMutation);

  //
  // Form Fields
  //
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !open || !teamName || !teamDescription;
  useEffect(() => {
    // The form resets here when `open` changes.
    setTeamName("");
    setTeamDescription("");
  }, [open]);

  //
  // Form Submit
  //
  const { trigger: createTeam } = useCreateTeamMutation();
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
      return;
    }
    await toast.promise(
      createTeam({ name: teamName, description: teamDescription }),
      {
        error: "There was an error creating the team.",
        loading: "Creating the team...",
        success: "Created the team!",
      }
    );
    onClose();
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal onClose={onClose} opened={open} size={"800px"}>
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Create a New Team</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Create a new team.
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <FormModalStyles.BodyContainerForm ref={formRef} onSubmit={onSubmit}>
        <FormModalStyles.InputContainer>
          <label htmlFor="team-name-input">Team Name</label>
          <Input
            id="team-name-input"
            required
            autoComplete="off"
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
            required
            autoComplete="off"
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
          />
        </FormModalStyles.InputContainer>
        <Flex justify={"flex-end"} gap="20px">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button disabled={isFormDisabled} onClick={onSubmit} type="submit">
            Create Team
          </Button>
        </Flex>
      </FormModalStyles.BodyContainerForm>
    </FormModalStyles.CustomModal>
  );
};

export default CreateNewTeamModal;
