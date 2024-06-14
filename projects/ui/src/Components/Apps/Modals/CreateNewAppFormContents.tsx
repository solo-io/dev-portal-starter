import { Input, Select } from "@mantine/core";
import { useEffect } from "react";
import { Team } from "../../../Apis/api-types";
import { FormModalStyles } from "../../../Styles/shared/FormModalStyles";
import { Accordion } from "../../Common/Accordion";

export interface CreateNewAppFormFields {
  appName: string;
  appDescription: string;
  appTeamId: string;
}

export interface CreateNewAppFormFieldSetters {
  setAppName: (newValue: string) => void;
  setAppDescription: (newValue: string) => void;
  setAppTeamId: (newValue: string) => void;
}

const CreateNewAppFormContents = ({
  formEnabled,
  teams,
  formFields,
  formFieldSetters,
}: {
  formEnabled: boolean;
  teams: Team[];
  formFields: CreateNewAppFormFields;
  formFieldSetters: CreateNewAppFormFieldSetters;
}) => {
  //
  // Form Fields
  //
  const { appName, appDescription, appTeamId } = formFields;
  const { setAppName, setAppDescription, setAppTeamId } = formFieldSetters;

  //
  // Form
  //
  useEffect(() => {
    // The form resets here when `formEnabled` changes.
    setAppTeamId("");
    setAppName("");
    setAppDescription("");
  }, [formEnabled]);

  //
  // Render
  //
  return (
    <div>
      <FormModalStyles.FormRow>
        <label htmlFor="app-team-select">App Team</label>
        <Select
          id="app-team-select"
          value={appTeamId}
          disabled={!formEnabled}
          onChange={(value) => {
            setAppTeamId(value ?? "");
          }}
          data={[
            {
              value: "",
              label: "Select a Team",
              disabled: true,
            },
            ...teams.map((t) => ({
              value: t.id,
              label: t.name,
            })),
          ]}
        />
      </FormModalStyles.FormRow>
      <Accordion open={!!appTeamId}>
        <FormModalStyles.FormRow>
          <label htmlFor="app-name-input">App Name</label>
          <Input
            id="app-name-input"
            required
            disabled={!appTeamId}
            placeholder="App Name"
            autoComplete="off"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
        </FormModalStyles.FormRow>
        <FormModalStyles.FormRow>
          <label htmlFor="app-description-input">App Description</label>
          <Input
            // This could be a Textarea if newlines exist in the description.
            // Then we would need to get the text content using a ref
            // so that newlines are preserved when saved.
            // <Textarea
            id="app-description-input"
            required
            placeholder="App Description"
            disabled={!appTeamId}
            autoComplete="off"
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
          />
        </FormModalStyles.FormRow>
      </Accordion>
    </div>
  );
};

export default CreateNewAppFormContents;
