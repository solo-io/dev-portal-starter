import { Box, CloseButton, Flex } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { WebhookEndpoint } from "../../../Apis/api-types";
import { useDeleteWebhookEndpointMutation } from "../../../Apis/gg_hooks";
import { FormModalStyles } from "../../../Styles/shared/FormModalStyles";
import { Button } from "../../Common/Button";

const DeleteWebhookEndpointModal = ({
  webhook,
  onClose,
}: {
  /** The webhook to confirm deleting. The modal is open while this is set. */
  webhook: WebhookEndpoint | undefined;
  onClose: () => void;
}) => {
  di(useDeleteWebhookEndpointMutation);
  const { trigger: deleteWebhook } = useDeleteWebhookEndpointMutation();

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!webhook) {
      return;
    }
    try {
      await toast.promise(deleteWebhook({ webhookId: webhook.id }), {
        error: (err) => "There was an error deleting the webhook. " + err,
        loading: "Deleting the webhook...",
        success: "Deleted the webhook!",
      });
      onClose();
    } catch {
      // The toast reports the error.
    }
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal
      onClose={onClose}
      opened={!!webhook}
      size={"600px"}
    >
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Delete Webhook</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to delete this webhook? It stops
            receiving events immediately, and it cannot be restored.
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <Box p="20px 30px 40px 30px">
        <Box mb="20px" sx={{ wordBreak: "break-all" }}>
          URL: {webhook?.url}
        </Box>
        <Flex justify={"flex-end"} gap="20px">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button color="danger" onClick={onSubmit} type="submit">
            Delete Webhook
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default DeleteWebhookEndpointModal;
