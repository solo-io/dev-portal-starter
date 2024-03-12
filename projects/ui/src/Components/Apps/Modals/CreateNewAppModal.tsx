import { CloseButton, Flex, Input, Select } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useCreateAppMutation, useListTeams } from "../../../Apis/hooks";
import { FormModalStyles } from "../../../Styles/shared/FormModalStyles";
import { Accordion } from "../../Common/Accordion";
import { Button } from "../../Common/Button";
import { Loading } from "../../Common/Loading";

const CreateNewAppModal = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  di(useListTeams, useCreateAppMutation);
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appTeamId, setTeamId] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !formRef.current?.checkValidity();
  const resetForm = () => {
    setTeamId("");
    setAppName("");
    setAppDescription("");
  };

  const { isLoading: isLoadingTeams, data: teams } = useListTeams();
  const { trigger: createApp } = useCreateAppMutation(appTeamId);

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    // Do HTML form validation.
    formRef.current?.reportValidity();
    if (isFormDisabled) {
      return;
    }
    await toast.promise(
      createApp({ name: appName, description: appDescription }),
      {
        error: "There was an error creating the app.",
        loading: "Creating the app...",
        success: "Created the app!",
      }
    );
    onClose();
  };

  // Reset the form on close.
  useEffect(() => {
    if (!opened) resetForm();
  }, [opened]);

  return (
    <FormModalStyles.CustomModal
      onClose={onClose}
      opened={opened}
      size={"800px"}
    >
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Create a New App</FormModalStyles.Title>
          <FormModalStyles.Subtitle>Create a new app.</FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      {isLoadingTeams || teams === undefined ? (
        <Loading />
      ) : (
        <FormModalStyles.BodyContainerForm ref={formRef} onSubmit={onSubmit}>
          <FormModalStyles.InputContainer>
            <label htmlFor="app-team-select">Team</label>
            <Select
              id="app-team-select"
              // This className="" is intentional and removes the antd select dropdown classname.
              className=""
              value={appTeamId}
              onChange={(value) => {
                setTeamId(value ?? "");
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
          </FormModalStyles.InputContainer>
          <Accordion open={!!appTeamId}>
            <FormModalStyles.InputContainer>
              <label htmlFor="app-name-input">App Name</label>
              <Input
                id="app-name-input"
                required
                disabled={!appTeamId}
                autoComplete="off"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
            </FormModalStyles.InputContainer>
            <FormModalStyles.InputContainer>
              <label htmlFor="app-description-input">App Description</label>
              <Input
                // This could be a Textarea if newlines exist in the description.
                // Then we would need to get the text content using a ref
                // so that newlines are preserved when saved.
                // <Textarea
                id="app-description-input"
                required
                disabled={!appTeamId}
                autoComplete="off"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
              />
            </FormModalStyles.InputContainer>
          </Accordion>
          <Flex justify={"flex-end"} gap="20px">
            <Button className="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button disabled={isFormDisabled} onClick={onSubmit} type="submit">
              Create App
            </Button>
          </Flex>
        </FormModalStyles.BodyContainerForm>
      )}
    </FormModalStyles.CustomModal>
  );
};

export default CreateNewAppModal;
