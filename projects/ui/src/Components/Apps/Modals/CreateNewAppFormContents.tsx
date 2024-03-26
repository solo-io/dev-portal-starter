import styled from "@emotion/styled";
import { Input, Select } from "@mantine/core";
import { useEffect } from "react";
import { Team } from "../../../Apis/api-types";
import { Accordion } from "../../Common/Accordion";

const StyledFormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 15px;
  label {
    width: 100%;
    padding: 0px;
    font-size: 1rem;
    margin-bottom: 5px;
    text-align: left;
  }
  .mantine-Input-wrapper,
  .mantine-InputWrapper-root {
    flex-grow: 1;
  }
`;

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
      <StyledFormRow>
        <label htmlFor="app-team-select">App Team</label>
        <Select
          id="app-team-select"
          // This className="" is intentional and removes the antd select dropdown classname.
          className=""
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
      </StyledFormRow>
      <Accordion open={!!appTeamId}>
        <StyledFormRow>
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
        </StyledFormRow>
        <StyledFormRow>
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
        </StyledFormRow>
      </Accordion>
    </div>
  );
};

export default CreateNewAppFormContents;
