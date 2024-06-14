import { CloseButton, Flex, Input } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { App } from "../../../../Apis/api-types";
import { useUpdateAppMutation } from "../../../../Apis/gg_hooks";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { Button } from "../../../Common/Button";
import DeleteAppModal from "./DeleteAppModal";

export const EditAppModal = ({
  opened,
  onClose,
  app,
}: {
  opened: boolean;
  onClose: () => void;
  app: App;
}) => {
  //
  // Form Fields
  //
  const [appName, setAppName] = useState(app.name);
  const [appDescription, setAppDescription] = useState(app.description);

  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !appName || !appDescription;
  useEffect(() => {
    // The form resets here when `open` or the default fields change.
    setAppName(app.name);
    setAppDescription(app.description);
  }, [app, opened]);

  //
  //  Form Submit
  //
  const { trigger: updateApp } = useUpdateAppMutation();
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
      return;
    }
    await toast.promise(
      updateApp({
        appId: app.id,
        appName,
        appDescription,
        appTeamId: app.teamId,
      }),
      {
        error: "There was an error updating the app.",
        loading: "Updating the app.",
        success: "Updated the app!",
      }
    );
    onClose();
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //
  // Render
  //
  return (
    <>
      <FormModalStyles.CustomModal
        onClose={onClose}
        opened={opened}
        size={"800px"}
      >
        <FormModalStyles.HeaderContainer>
          <div>
            <FormModalStyles.Title>Edit App</FormModalStyles.Title>
            <FormModalStyles.Subtitle>
              Edit the title and description for this App.
            </FormModalStyles.Subtitle>
          </div>
          <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
        </FormModalStyles.HeaderContainer>
        <FormModalStyles.HorizLine />
        <FormModalStyles.BodyContainerForm ref={formRef} onSubmit={onSubmit}>
          <div>
            <FormModalStyles.FormRow>
              <label htmlFor="app-name-input">App Name</label>
              <Input
                id="app-name-input"
                required
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
                autoComplete="off"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
              />
            </FormModalStyles.FormRow>
          </div>

          <Flex justify={"space-between"}>
            <Button color="danger" onClick={() => setShowDeleteModal(true)}>
              Delete App
            </Button>
            <Flex justify={"flex-end"} gap="20px">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button
                disabled={isFormDisabled}
                onClick={onSubmit}
                type="submit"
              >
                Update App
              </Button>
            </Flex>
          </Flex>
        </FormModalStyles.BodyContainerForm>
      </FormModalStyles.CustomModal>
      <DeleteAppModal
        app={app}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
};
