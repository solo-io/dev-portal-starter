import { CloseButton, Flex, Input } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Team } from "../../../../Apis/api-types";
import { useUpdateTeamMutation } from "../../../../Apis/hooks";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { Button } from "../../../Common/Button";

export const EditTeamModal = ({
  opened,
  onClose,
  team,
}: {
  opened: boolean;
  onClose: () => void;
  team: Team;
}) => {
  //
  // Form Fields
  //
  const [teamName, setTeamName] = useState(team.name);
  const [teamDescription, setTeamDescription] = useState(team.description);

  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !teamName || !teamDescription;
  useEffect(() => {
    // The form resets here when `open` or the default fields change.
    setTeamName(team.name);
    setTeamDescription(team.description);
  }, [team, opened]);

  //
  //  Form Submit
  //
  const { trigger: updateTeam } = useUpdateTeamMutation();
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
      return;
    }
    await toast.promise(
      updateTeam({
        teamId: team.id,
        teamName,
        teamDescription,
      }),
      {
        error: "There was an error updating the team.",
        loading: "Updating the team.",
        success: "Updated the team!",
      }
    );
    onClose();
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal
      onClose={onClose}
      opened={opened}
      size={"800px"}
    >
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Edit Team</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Edit the title and description for this Team.
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <FormModalStyles.BodyContainerForm ref={formRef} onSubmit={onSubmit}>
        <div>
          <FormModalStyles.FormRow>
            <label htmlFor="team-name-input">Team Name</label>
            <Input
              id="team-name-input"
              required
              placeholder="Team Name"
              autoComplete="off"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </FormModalStyles.FormRow>
          <FormModalStyles.FormRow>
            <label htmlFor="team-description-input">Team Description</label>
            <Input
              // This could be a Textarea if newlines exist in the description.
              // Then we would need to get the text content using a ref
              // so that newlines are preserved when saved.
              // <Textarea
              id="team-description-input"
              required
              placeholder="Team Description"
              autoComplete="off"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
            />
          </FormModalStyles.FormRow>
        </div>

        <Flex justify={"flex-end"} gap="20px">
          <Button className="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button disabled={isFormDisabled} onClick={onSubmit} type="submit">
            Update Team
          </Button>
        </Flex>
      </FormModalStyles.BodyContainerForm>
    </FormModalStyles.CustomModal>
  );
};
