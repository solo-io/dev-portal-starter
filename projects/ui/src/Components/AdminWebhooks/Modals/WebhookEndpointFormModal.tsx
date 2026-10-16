import { Box, CloseButton, Flex, Input, Switch } from "@mantine/core";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { WebhookEndpoint } from "../../../Apis/api-types";
import {
  useCreateWebhookEndpointMutation,
  useUpdateWebhookEndpointMutation,
} from "../../../Apis/gg_hooks";
import { FormModalStyles } from "../../../Styles/shared/FormModalStyles";
import { Button } from "../../Common/Button";

/**
 * Returns why the portal server would reject this webhook URL, or undefined if
 * it would accept it. The server requires an absolute http or https URL with a
 * host, and checking here lets the form say so before submitting.
 *
 * The browser's URL parser repairs input that the server's parser (Go's
 * net/url) rejects as written: it drops tabs and newlines, reads backslashes
 * as slashes, and supplies a missing or extra "//" before the host, as in
 * "https:example.com" or "http:///example.com". So the URL must also be in
 * the form the server accepts as typed.
 */
export function getWebhookUrlError(value: string): string | undefined {
  if (/[\s\\]/.test(value)) {
    return "The URL cannot contain spaces, tabs, or backslashes.";
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "Enter an absolute URL, such as https://example.com/hooks/portal.";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "The URL must use the http or https scheme.";
  }
  if (!/^https?:\/\/[^/?#]/i.test(value)) {
    return "The URL must start with http:// or https:// followed by a host.";
  }
  return undefined;
}

/**
 * Creates a webhook endpoint or, when given `webhook`, edits that one.
 */
const WebhookEndpointFormModal = ({
  open,
  onClose,
  webhook,
}: {
  open: boolean;
  onClose: () => void;
  webhook?: WebhookEndpoint;
}) => {
  di(useCreateWebhookEndpointMutation, useUpdateWebhookEndpointMutation);
  const isEditing = !!webhook;

  //
  // Form Fields
  //
  const [url, setUrl] = useState("");
  const [enabled, setEnabled] = useState(true);

  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  // Surrounding whitespace, as from a paste, is dropped rather than rejected.
  const trimmedUrl = url.trim();
  const urlError = !!trimmedUrl ? getWebhookUrlError(trimmedUrl) : undefined;
  const isFormDisabled = !open || !trimmedUrl || !!urlError;
  useEffect(() => {
    // The form resets here when `open` or the webhook being edited changes.
    setUrl(webhook?.url ?? "");
    setEnabled(webhook?.enabled ?? true);
  }, [webhook, open]);

  //
  // Form Submit
  //
  const { trigger: createWebhook } = useCreateWebhookEndpointMutation();
  const { trigger: updateWebhook } = useUpdateWebhookEndpointMutation();
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
      return;
    }
    try {
      await toast.promise(
        isEditing
          ? updateWebhook({ webhookId: webhook.id, url: trimmedUrl, enabled })
          : createWebhook({ url: trimmedUrl, enabled }),
        {
          error: (err) =>
            `There was an error ${
              isEditing ? "updating" : "creating"
            } the webhook. ` + err,
          loading: `${isEditing ? "Updating" : "Creating"} the webhook...`,
          success: `${isEditing ? "Updated" : "Created"} the webhook!`,
        }
      );
      onClose();
    } catch {
      // The toast reports the error, and the form stays open to correct it.
    }
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal onClose={onClose} opened={open} size={"800px"}>
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>
            {isEditing ? "Edit Webhook" : "Add a Webhook"}
          </FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            The portal sends a POST request with a JSON event body to this URL
            whenever a portal event occurs, such as a subscription being
            requested.
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <FormModalStyles.BodyContainerForm ref={formRef} onSubmit={onSubmit}>
        <FormModalStyles.InputContainer>
          <label htmlFor="webhook-url-input">URL</label>
          <Input
            id="webhook-url-input"
            required
            placeholder="https://example.com/hooks/portal"
            autoComplete="off"
            value={url}
            error={!!urlError}
            aria-describedby="webhook-url-description"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUrl(e.target.value)
            }
          />
          {urlError ? (
            <Input.Error id="webhook-url-description" mt="5px">
              {urlError}
            </Input.Error>
          ) : (
            <Input.Description id="webhook-url-description" mt="5px">
              Events include the requesting user's email address, so prefer
              https.
            </Input.Description>
          )}
        </FormModalStyles.InputContainer>
        {/*
        // Not an InputContainer, whose block-level label style would stretch
        // the switch, rendered inside a label, across the modal.
        */}
        <Box>
          <Switch
            id="webhook-enabled-input"
            label="Enabled"
            checked={enabled}
            aria-describedby="webhook-enabled-description"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEnabled(e.currentTarget.checked)
            }
          />
          <Input.Description id="webhook-enabled-description" mt="5px">
            A disabled webhook receives no events but can still be tested, so a
            new receiver can be checked before it goes live.
          </Input.Description>
        </Box>
        <Flex justify={"flex-end"} gap="20px">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button disabled={isFormDisabled} onClick={onSubmit} type="submit">
            {isEditing ? "Update Webhook" : "Add Webhook"}
          </Button>
        </Flex>
      </FormModalStyles.BodyContainerForm>
    </FormModalStyles.CustomModal>
  );
};

export default WebhookEndpointFormModal;
