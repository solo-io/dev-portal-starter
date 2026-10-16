import { Box, CloseButton, Flex, Input, Textarea } from "@mantine/core";
import { ChangeEvent, useState } from "react";
import { di } from "react-magnetic-di";
import { WebhookEndpoint, WebhookTestResult } from "../../../Apis/api-types";
import { useTestWebhookEndpointMutation } from "../../../Apis/gg_hooks";
import { FormModalStyles } from "../../../Styles/shared/FormModalStyles";
import { colors } from "../../../Styles/colors";
import { Button } from "../../Common/Button";

/**
 * Whether a delivery error came from the TLS handshake, which the admin cannot
 * fix from this page: the trusted CA and the client certificate are operator
 * configuration.
 */
export function isTlsError(error: string): boolean {
  return /\b(tls|x509)\b/i.test(error);
}

/**
 * The test request body the dialog starts with. The body names the event type
 * to send an example of, and `portal.subscription.created` is the only type
 * the portal emits.
 */
export const DEFAULT_TEST_REQUEST_BODY = JSON.stringify(
  { type: "portal.subscription.created" },
  null,
  2
);

/**
 * Returns why a test request body cannot be sent, or undefined if it can. The
 * body must be a JSON object; the portal server checks its contents.
 */
export function getTestRequestBodyError(body: string): string | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return "The test request must be valid JSON.";
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return "The test request must be a JSON object.";
  }
  return undefined;
}

/** The result of one test, or why the test request itself failed. */
type TestOutcome = {
  webhookId: string;
  result?: WebhookTestResult;
  requestError?: string;
};

function TestOutcomeDetails({ outcome }: { outcome: TestOutcome }) {
  const { result, requestError } = outcome;
  if (!result) {
    return (
      <Box sx={{ color: colors.midRed }}>
        The test could not be sent. {requestError}
      </Box>
    );
  }
  if (result.success) {
    return (
      <Box sx={{ color: colors.darkGreen }}>
        The receiver accepted the test event
        {result.statusCode !== undefined
          ? ` with status ${result.statusCode}`
          : ""}
        .
      </Box>
    );
  }
  return (
    <Flex direction={"column"} gap={"10px"}>
      <Box sx={{ color: colors.midRed }}>
        {result.statusCode !== undefined
          ? `The receiver responded with status ${result.statusCode}.`
          : "No response was received from the receiver."}
      </Box>
      {!!result.error && (
        <Box
          sx={{
            fontFamily: "monospace",
            wordBreak: "break-word",
            color: colors.septemberGrey,
          }}
        >
          {result.error}
        </Box>
      )}
      {!!result.error && isTlsError(result.error) && (
        <Box>
          An https receiver whose certificate is from a private CA, or that
          requires a client certificate, needs the portal's operator to
          configure them in the <code>webhooks.tls</code> settings of the
          PortalParameters resource.
        </Box>
      )}
    </Flex>
  );
}

const TestWebhookEndpointModal = ({
  webhook,
  onClose,
}: {
  /** The webhook to test. The modal is open while this is set. */
  webhook: WebhookEndpoint | undefined;
  onClose: () => void;
}) => {
  di(useTestWebhookEndpointMutation);
  const { trigger: testWebhook } = useTestWebhookEndpointMutation();

  const [sending, setSending] = useState(false);
  const [requestBody, setRequestBody] = useState(DEFAULT_TEST_REQUEST_BODY);
  const requestBodyError = getTestRequestBodyError(requestBody);
  // Shown only while it belongs to the webhook in the modal, so a test that
  // finishes after the modal moved on to another webhook is not shown there.
  const [outcome, setOutcome] = useState<TestOutcome>();
  const shownOutcome =
    !!webhook && outcome?.webhookId === webhook.id ? outcome : undefined;

  const close = () => {
    setOutcome(undefined);
    setRequestBody(DEFAULT_TEST_REQUEST_BODY);
    onClose();
  };

  const sendTest = async () => {
    if (!webhook || requestBodyError) {
      return;
    }
    const webhookId = webhook.id;
    setSending(true);
    setOutcome(undefined);
    try {
      const result = await testWebhook({ webhookId, body: requestBody });
      setOutcome({ webhookId, result });
    } catch (err) {
      setOutcome({
        webhookId,
        requestError: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSending(false);
    }
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal
      onClose={close}
      opened={!!webhook}
      size={"700px"}
    >
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Test Webhook</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Has the portal send an example event of the type the test request
            names to this URL, the same way as a real event, and shows how the
            receiver responded. Every resource ID in the example is all zeros,
            so a receiver can tell it apart from a real event.
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={close} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <Flex direction={"column"} gap={"20px"} p="0px 30px 40px 30px">
        <Box sx={{ wordBreak: "break-all" }}>URL: {webhook?.url}</Box>
        {webhook?.enabled === false && (
          <Box>
            This webhook is disabled. It receives test events but no other
            events until it is enabled.
          </Box>
        )}
        <Box>
          <Textarea
            id="webhook-test-body-input"
            label="Portal test request"
            autosize
            minRows={3}
            spellCheck={false}
            styles={{ input: { fontFamily: "monospace" } }}
            value={requestBody}
            error={!!requestBodyError}
            aria-describedby="webhook-test-body-description"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setRequestBody(e.target.value)
            }
          />
          {requestBodyError ? (
            <Input.Error id="webhook-test-body-description" mt="5px">
              {requestBodyError}
            </Input.Error>
          ) : (
            <Input.Description id="webhook-test-body-description" mt="5px">
              Sent to the portal server, not to the webhook. The portal sends
              the webhook an example event of this <code>type</code>.
            </Input.Description>
          )}
        </Box>
        {!!shownOutcome && <TestOutcomeDetails outcome={shownOutcome} />}
        <Flex justify={"flex-end"} gap="20px">
          <Button variant="outline" onClick={close} type="button">
            Close
          </Button>
          <Button
            disabled={sending || !!requestBodyError}
            onClick={sendTest}
            type="button"
          >
            {sending ? "Sending..." : "Send Test Event"}
          </Button>
        </Flex>
      </Flex>
    </FormModalStyles.CustomModal>
  );
};

export default TestWebhookEndpointModal;
