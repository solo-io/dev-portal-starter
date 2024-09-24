import { Box, CloseButton, Flex } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useDeleteOAuthMutation } from "../../../../Apis/gg_hooks";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { Button } from "../../../Common/Button";

const ConfirmDeleteOAuthModal = ({
  credentialId,
  appId,
  open,
  onClose,
}: {
  credentialId: string;
  appId: string;
  open: boolean;
  onClose: () => void;
}) => {
  di(useDeleteOAuthMutation);
  const { trigger: deleteOAuth } = useDeleteOAuthMutation(appId);
  const onConfirm = async (e?: FormEvent) => {
    e?.preventDefault();
    await toast.promise(deleteOAuth({ credentialId }), {
      error: (e) => "There was an error deleting the OAuth credentials. " + e,
      loading: "Deleting the OAuth credentials...",
      success: "Deleted the OAuth credentials!",
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
          <FormModalStyles.Title>Delete OAuth Client</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to delete the OAuth Client for this App?
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
          <Button color="danger" onClick={onConfirm} type="submit">
            Delete OAuth Client
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default ConfirmDeleteOAuthModal;
