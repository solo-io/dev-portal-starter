import { CloseButton, Flex } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useCreateAppMutation, useListTeams } from "../../../Apis/gg_hooks";
import { FormModalStyles } from "../../../Styles/shared/FormModalStyles";
import { Button } from "../../Common/Button";
import { Loading } from "../../Common/Loading";
import CreateNewAppFormContents from "./CreateNewAppFormContents";

const CreateNewAppModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  di(useListTeams, useCreateAppMutation);
  const { isLoading: isLoadingTeams, data: teams } = useListTeams();

  //
  // Form Fields
  //
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appTeamId, setAppTeamId] = useState("");

  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !open || !appName || !appDescription || !appTeamId;
  useEffect(() => {
    // The form resets here when `open` changes.
    setAppTeamId("");
    setAppName("");
    setAppDescription("");
  }, [open]);

  //
  // Form Submit
  //
  const { trigger: createApp } = useCreateAppMutation(appTeamId);
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
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

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal onClose={onClose} opened={open} size={"800px"}>
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Create a New App</FormModalStyles.Title>
          <FormModalStyles.Subtitle>Create a new app.</FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      {isLoadingTeams || teams === undefined ? (
        <Loading />
      ) : (
        <FormModalStyles.BodyContainerForm ref={formRef} onSubmit={onSubmit}>
          <CreateNewAppFormContents
            formEnabled={open}
            teams={teams}
            formFields={{
              appName,
              appDescription,
              appTeamId,
            }}
            formFieldSetters={{
              setAppName,
              setAppDescription,
              setAppTeamId,
            }}
          />
          <Flex justify={"flex-end"} gap="20px">
            <Button variant="outline" onClick={onClose} type="button">
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
