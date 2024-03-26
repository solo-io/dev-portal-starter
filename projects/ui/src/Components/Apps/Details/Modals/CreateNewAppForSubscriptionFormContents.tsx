import styled from "@emotion/styled";
import { Box, Input, Select } from "@mantine/core";
import { useEffect } from "react";
import { Team } from "../../../../Apis/api-types";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { Accordion } from "../../../Common/Accordion";
import {
  CreateNewAppFormFieldSetters,
  CreateNewAppFormFields,
} from "../../Modals/CreateNewAppFormContents";

const StyledFormRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 0;
  label {
    width: 150px;
    padding: 0px;
    font-size: 1rem;
    text-align: left;
    padding-left: 15px;
  }
  .mantine-InputWrapper-root {
    flex-grow: 1;
    padding-right: 15px;
  }
`;

const CreateNewAppForSubscriptionFormContents = ({
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
    <Accordion open={!!formEnabled}>
      <GridCardStyles.GridCard wide>
        <Box py={"15px"}>
          <StyledFormRow>
            <label htmlFor="app-team-select">App Team</label>
            <Select
              id="app-team-select"
              // aria-label={!useLabels ? "App Team" : ""}
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
                // aria-label={!useLabels ? "App Name" : ""}
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
                // aria-label={!useLabels ? "App Description" : ""}
                required
                placeholder="App Description"
                disabled={!appTeamId}
                autoComplete="off"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
              />
            </StyledFormRow>
          </Accordion>
        </Box>
      </GridCardStyles.GridCard>
    </Accordion>
  );
};

export default CreateNewAppForSubscriptionFormContents;