import { Box, Input } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Team } from "../../../../Apis/api-types";
import { useAddTeamMemberMutation } from "../../../../Apis/hooks";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { Accordion } from "../../../Common/Accordion";
import { Button } from "../../../Common/Button";

const AddTeamUserSubSection = ({
  open,
  onClose,
  team,
}: {
  open: boolean;
  onClose: () => void;
  team: Team;
}) => {
  const [formEmail, setFormEmail] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled =
    !formRef.current?.checkValidity() || !open || !formEmail;

  const resetForm = () => {
    setFormEmail("");
  };

  useEffect(() => {
    resetForm();
  }, [open]);

  const { trigger: addUserToTeam } = useAddTeamMemberMutation(team.id);

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    // Do HTML form validation.
    formRef.current?.reportValidity();
    if (isFormDisabled) {
      return;
    }
    await toast.promise(addUserToTeam({ email: formEmail }), {
      error: "There was an error adding the user.",
      loading: "Adding the user...",
      success: "Added the user!",
    });
    onClose();
  };

  return (
    <Accordion open={open}>
      <Box pb={"10px"}>
        <DetailsPageStyles.AddItemForm ref={formRef} onSubmit={onSubmit}>
          <Input
            id="member-email-input"
            aria-label="new team member email"
            required
            disabled={!open}
            placeholder="Email Address"
            autoComplete="off"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
          />
          <Button
            className={`small`}
            disabled={isFormDisabled}
            tabIndex={isFormDisabled ? -1 : 0}
            type={"submit"}
          >
            ADD USER
          </Button>
        </DetailsPageStyles.AddItemForm>
      </Box>
    </Accordion>
  );
};

export default AddTeamUserSubSection;
