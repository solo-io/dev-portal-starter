import { Box, Input } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { Team } from "../../../../Apis/api-types";
import { useCreateAppMutation } from "../../../../Apis/hooks";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { Accordion } from "../../../Common/Accordion";
import { Button } from "../../../Common/Button";

const AddTeamAppSubSection = ({
  open,
  onClose,
  team,
}: {
  open: boolean;
  onClose: () => void;
  team: Team;
}) => {
  di(useCreateAppMutation);

  //
  // Form Fields
  //
  const [formAppName, setFormAppName] = useState("");
  const [formAppDescription, setFormAppDescription] = useState("");

  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !open || !formAppName || !formAppDescription;
  const resetForm = () => {
    setFormAppName("");
    setFormAppDescription("");
  };
  useEffect(resetForm, [open]);

  //
  // Form Submit
  //
  const { trigger: createApp } = useCreateAppMutation(team.id);
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
      return;
    }
    await toast.promise(
      createApp({ name: formAppName, description: formAppDescription }),
      {
        error: "There was an error creating the app.",
        loading: "Creating the app...",
        success: "Created the app!",
      }
    );
    onClose();
  };

  //
  // Render
  //
  return (
    <Accordion open={open}>
      <Box pb={"10px"}>
        <DetailsPageStyles.AddItemForm ref={formRef} onSubmit={onSubmit}>
          <Input
            id="app-name-input"
            aria-label="app name"
            required
            placeholder="App Name"
            disabled={!open}
            autoComplete="off"
            value={formAppName}
            onChange={(e) => setFormAppName(e.target.value)}
          />
          <Input
            id="app-description-input"
            aria-label="app description"
            required
            placeholder="App Description"
            disabled={!open}
            autoComplete="off"
            value={formAppDescription}
            onChange={(e) => setFormAppDescription(e.target.value)}
          />
          <Button
            className={`small ${isFormDisabled ? "disabled" : ""}`}
            disabled={isFormDisabled}
            type={"submit"}
          >
            ADD APP
          </Button>
        </DetailsPageStyles.AddItemForm>
      </Box>
    </Accordion>
  );
};

export default AddTeamAppSubSection;
