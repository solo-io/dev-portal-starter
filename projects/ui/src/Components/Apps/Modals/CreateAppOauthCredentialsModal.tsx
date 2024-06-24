import { CloseButton, Flex } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { App } from "../../../Apis/api-types";
import { FormModalStyles } from "../../../Styles/shared/FormModalStyles";
import { Button } from "../../Common/Button";
import { Loading } from "../../Common/Loading";
import {
  AppOauthCredentials,
  generateSomeIdForDemo,
} from "../Details/AuthenticationSection/AppAuthenticationSection";

const CreateAppOauthCredentialsModal = ({
  open,
  onClose,
  app,
  onOauthCredentialsCreated,
}: {
  open: boolean;
  onClose: () => void;
  app: App;
  onOauthCredentialsCreated(newCredentials: AppOauthCredentials): void;
}) => {
  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !open;

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      return;
    }
    (async () => {
      await new Promise((resolve, _) => setTimeout(() => resolve(true), 200));
      if (open) setIsLoading(false);
    })();
  }, [open]);

  //
  // Form Submit
  //
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (isFormDisabled) {
      return;
    }
    await toast.promise(
      new Promise((resolve, _) =>
        setTimeout(() => {
          // Create fake client id and secret.
          onOauthCredentialsCreated({
            oauthClientId: "client-id-" + new Date().valueOf(),
            oauthClientSecret: generateSomeIdForDemo(),
          });
          resolve(true);
        }, 200)
      ),
      {
        error: "There was an error creating the client credentials.",
        loading: "Creating the client credentials...",
        success: "Created the client credentials!",
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
          <FormModalStyles.Title>
            Create OAuth Credentials
          </FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Create OAuth credentials for an application.
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      {isLoading ? (
        <Loading />
      ) : (
        <FormModalStyles.BodyContainerForm ref={formRef} onSubmit={onSubmit}>
          <div>
            Are you sure that you want to create OAuth credentials for{" "}
            <b>"{app.name}"</b>?
          </div>
          <Flex justify={"flex-end"} gap="20px">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button disabled={isFormDisabled} onClick={onSubmit} type="submit">
              Create OAuth Credentials
            </Button>
          </Flex>
        </FormModalStyles.BodyContainerForm>
      )}
    </FormModalStyles.CustomModal>
  );
};

export default CreateAppOauthCredentialsModal;
