import { Box, CloseButton, Flex } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useDeleteApiKeyMutation } from "../../../../Apis/gg_hooks";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { Button } from "../../../Common/Button";

const ConfirmDeleteApiKeyModal = ({
  apiKeyId,
  appId,
  open,
  onClose,
}: {
  apiKeyId: string;
  appId: string;
  open: boolean;
  onClose: () => void;
}) => {
  di(useDeleteApiKeyMutation);
  const { trigger: deleteApiKey } = useDeleteApiKeyMutation(appId);
  const onConfirm = async (e?: FormEvent) => {
    e?.preventDefault();
    await toast.promise(deleteApiKey({ apiKeyId }), {
      error: (e) => "There was an error deleting the API Key. " + e,
      loading: "Deleting the API Key...",
      success: "Deleted the API Key!",
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
          <FormModalStyles.Title>Delete API Key</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to delete this API Key?
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
            Delete API Key
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default ConfirmDeleteApiKeyModal;
