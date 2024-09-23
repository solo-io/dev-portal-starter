import { Box, CloseButton, Flex } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useCreateOAuthMutation } from "../../../../Apis/gg_hooks";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { Button } from "../../../Common/Button";

const ConfirmCreateOAuthModal = ({
  appId,
  open,
  onClose,
}: {
  appId: string;
  open: boolean;
  onClose: () => void;
}) => {
  di(useCreateOAuthMutation);
  const { trigger: createOAuth } = useCreateOAuthMutation(appId);
  const onConfirm = async (e?: FormEvent) => {
    e?.preventDefault();
    await toast.promise(createOAuth(), {
      error: (e) => "There was an error creating OAuth client. " + e,
      loading: "Creating the OAuth client...",
      success: "Created the OAuth client!",
    });
    onClose();
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal onClose={onClose} opened={open} size={"600px"}>
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Create OAuth Client</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to create an OAuth Client for this App?
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <Box p="20px 30px 40px 30px">
        <Flex justify={"flex-end"} gap="20px">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button color="primary" onClick={onConfirm} type="submit">
            Create OAuth Client
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default ConfirmCreateOAuthModal;
