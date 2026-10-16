import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { DiProvider, injectable } from "react-magnetic-di";
import { afterEach, describe, expect, it } from "vitest";

import { WebhookEndpoint, WebhookTestResult } from "../../Apis/api-types";
import {
  useCreateWebhookEndpointMutation,
  useDeleteWebhookEndpointMutation,
  useListWebhookEndpoints,
  useTestWebhookEndpointMutation,
  useUpdateWebhookEndpointMutation,
} from "../../Apis/gg_hooks";
import { HttpError } from "../../Apis/utility";
import AdminWebhooksPage from "./AdminWebhooksPage";
import {
  DEFAULT_TEST_REQUEST_BODY,
  getTestRequestBodyError,
  isTlsError,
} from "./Modals/TestWebhookEndpointModal";
import { getWebhookUrlError } from "./Modals/WebhookEndpointFormModal";

const webhook: WebhookEndpoint = {
  id: "webhook_1",
  url: "https://hooks.example.com/portal",
  enabled: true,
  createdAt: "2026-01-02T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
};

type CreateArg = { url: string; enabled: boolean };
type UpdateArg = { webhookId: string } & CreateArg;
type TestArg = { webhookId: string; body: string };

/**
 * Renders the page with its data hooks replaced. With an `error`, the list
 * request failed and, as with SWR, there is no data. A test resolves with
 * `testResult` unless `testError` is set. The `*Args` arrays record what each
 * mutation was called with.
 */
function renderPage({
  webhooks = [] as WebhookEndpoint[],
  error = undefined as unknown,
  testResult = { success: true, statusCode: 204 } as WebhookTestResult,
  testError = undefined as unknown,
} = {}) {
  const createArgs: CreateArg[] = [];
  const updateArgs: UpdateArg[] = [];
  const deleteArgs: { webhookId: string }[] = [];
  const testArgs: TestArg[] = [];
  render(
    <DiProvider
      use={[
        injectable(useListWebhookEndpoints, () => ({
          isLoading: false,
          data: error ? undefined : webhooks,
          error,
        })),
        injectable(useCreateWebhookEndpointMutation, () => ({
          trigger: async (arg: CreateArg) => {
            createArgs.push(arg);
            return { ...webhook, ...arg };
          },
        })),
        injectable(useUpdateWebhookEndpointMutation, () => ({
          trigger: async ({ webhookId, ...fields }: UpdateArg) => {
            updateArgs.push({ webhookId, ...fields });
            return { ...webhook, ...fields, id: webhookId };
          },
        })),
        injectable(useDeleteWebhookEndpointMutation, () => ({
          trigger: async (arg: { webhookId: string }) => {
            deleteArgs.push(arg);
          },
        })),
        injectable(useTestWebhookEndpointMutation, () => ({
          trigger: async (arg: TestArg) => {
            testArgs.push(arg);
            if (testError) {
              throw testError;
            }
            return testResult;
          },
        })),
      ]}
    >
      <MemoryRouter>
        <AdminWebhooksPage />
      </MemoryRouter>
    </DiProvider>
  );
  return { createArgs, updateArgs, deleteArgs, testArgs };
}

afterEach(() => {
  cleanup();
});

describe("AdminWebhooksPage", () => {
  it("lists each webhook's URL", () => {
    renderPage({ webhooks: [webhook] });

    expect(screen.getByText(webhook.url)).toBeTruthy();
  });

  it("shows whether each webhook is enabled", () => {
    renderPage({
      webhooks: [
        webhook,
        {
          ...webhook,
          id: "webhook_2",
          url: "https://off.example.com",
          enabled: false,
        },
      ],
    });

    expect(screen.getByText("Enabled")).toBeTruthy();
    expect(screen.getByText("Disabled")).toBeTruthy();
  });

  it("shows the empty state when there are no webhooks", () => {
    renderPage();

    expect(screen.getByText("No webhooks were found.")).toBeTruthy();
  });

  // Without the route, the server has no webhooks to offer.
  it("says the server has no webhook support when the route is missing", () => {
    renderPage({ error: new HttpError("Not found", 404) });

    expect(
      screen.getByText("This portal server does not support webhooks.")
    ).toBeTruthy();
  });

  it("says the list could not be loaded when the request fails", () => {
    renderPage({ error: new HttpError("upstream unavailable", 503) });

    expect(screen.getByText("The webhooks could not be loaded.")).toBeTruthy();
    expect(screen.getByText("upstream unavailable")).toBeTruthy();
  });

  it("creates a webhook from the add form", async () => {
    const { createArgs } = renderPage();

    fireEvent.click(screen.getByText("ADD WEBHOOK"));
    fireEvent.change(await screen.findByLabelText("URL"), {
      target: { value: "https://new.example.com/hook" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Add Webhook" }));
    });

    expect(createArgs).toEqual([
      { url: "https://new.example.com/hook", enabled: true },
    ]);
  });

  it("drops whitespace around a pasted URL", async () => {
    const { createArgs } = renderPage();

    fireEvent.click(screen.getByText("ADD WEBHOOK"));
    fireEvent.change(await screen.findByLabelText("URL"), {
      target: { value: "  https://new.example.com/hook  " },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Add Webhook" }));
    });

    expect(createArgs).toEqual([
      { url: "https://new.example.com/hook", enabled: true },
    ]);
  });

  it("will not submit a URL the server would reject", async () => {
    const { createArgs } = renderPage();

    fireEvent.click(screen.getByText("ADD WEBHOOK"));
    fireEvent.change(await screen.findByLabelText("URL"), {
      target: { value: "ftp://files.example.com" },
    });

    expect(
      screen.getByText("The URL must use the http or https scheme.")
    ).toBeTruthy();
    const submit = screen.getByRole("button", { name: "Add Webhook" });
    expect(submit.hasAttribute("disabled")).toBe(true);
    await act(async () => {
      fireEvent.click(submit);
    });
    expect(createArgs).toEqual([]);
  });

  it("edits a webhook's URL", async () => {
    const { updateArgs } = renderPage({ webhooks: [webhook] });

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const urlInput = (await screen.findByLabelText("URL")) as HTMLInputElement;
    expect(urlInput.value).toBe(webhook.url);
    fireEvent.change(urlInput, {
      target: { value: "https://moved.example.com/hook" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Update Webhook" }));
    });

    expect(updateArgs).toEqual([
      {
        webhookId: webhook.id,
        url: "https://moved.example.com/hook",
        enabled: true,
      },
    ]);
  });

  it("creates a disabled webhook", async () => {
    const { createArgs } = renderPage();

    fireEvent.click(screen.getByText("ADD WEBHOOK"));
    fireEvent.change(await screen.findByLabelText("URL"), {
      target: { value: "https://new.example.com/hook" },
    });
    fireEvent.click(screen.getByLabelText("Enabled"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Add Webhook" }));
    });

    expect(createArgs).toEqual([
      { url: "https://new.example.com/hook", enabled: false },
    ]);
  });

  // The server enables a webhook whose update leaves `enabled` out, so an
  // edit has to send the current state.
  it("keeps a disabled webhook disabled when its URL is edited", async () => {
    const { updateArgs } = renderPage({
      webhooks: [{ ...webhook, enabled: false }],
    });

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const enabledInput = (await screen.findByLabelText(
      "Enabled"
    )) as HTMLInputElement;
    expect(enabledInput.checked).toBe(false);
    fireEvent.change(screen.getByLabelText("URL"), {
      target: { value: "https://moved.example.com/hook" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Update Webhook" }));
    });

    expect(updateArgs).toEqual([
      {
        webhookId: webhook.id,
        url: "https://moved.example.com/hook",
        enabled: false,
      },
    ]);
  });

  it("enables a disabled webhook", async () => {
    const { updateArgs } = renderPage({
      webhooks: [{ ...webhook, enabled: false }],
    });

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(await screen.findByLabelText("Enabled"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Update Webhook" }));
    });

    expect(updateArgs).toEqual([
      { webhookId: webhook.id, url: webhook.url, enabled: true },
    ]);
  });

  it("names the webhook it is about to delete", async () => {
    const { deleteArgs } = renderPage({ webhooks: [webhook] });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(await screen.findByText(`URL: ${webhook.url}`)).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Delete Webhook" }));
    });
    expect(deleteArgs).toEqual([{ webhookId: webhook.id }]);
  });
});

describe("AdminWebhooksPage test action", () => {
  async function sendTest(body?: string) {
    fireEvent.click(screen.getByRole("button", { name: "Test" }));
    if (body !== undefined) {
      fireEvent.change(await screen.findByLabelText("Portal test request"), {
        target: { value: body },
      });
    }
    const send = await screen.findByRole("button", {
      name: "Send Test Event",
    });
    await act(async () => {
      fireEvent.click(send);
    });
  }

  it("tests the chosen webhook and reports success", async () => {
    const { testArgs } = renderPage({ webhooks: [webhook] });

    await sendTest();

    expect(testArgs).toEqual([
      { webhookId: webhook.id, body: DEFAULT_TEST_REQUEST_BODY },
    ]);
    expect(JSON.parse(DEFAULT_TEST_REQUEST_BODY)).toEqual({
      type: "portal.subscription.created",
    });
    expect(
      await screen.findByText(
        /receiver accepted the test event with status 204/
      )
    ).toBeTruthy();
  });

  it("sends the test request as edited", async () => {
    const { testArgs } = renderPage({ webhooks: [webhook] });

    await sendTest('{"type": "portal.subscription.deleted"}');

    expect(testArgs).toEqual([
      {
        webhookId: webhook.id,
        body: '{"type": "portal.subscription.deleted"}',
      },
    ]);
  });

  it("will not send a test request that is not a JSON object", async () => {
    const { testArgs } = renderPage({ webhooks: [webhook] });

    await sendTest("{type: portal.subscription.created}");

    expect(screen.getByText("The test request must be valid JSON.")).toBeTruthy();
    expect(
      screen
        .getByRole("button", { name: "Send Test Event" })
        .hasAttribute("disabled")
    ).toBe(true);
    expect(testArgs).toEqual([]);
  });

  // The server answers 200 for a failing receiver, so the result has to be
  // read rather than relying on the request failing.
  it("reports the status of a receiver that rejected the test", async () => {
    renderPage({
      webhooks: [webhook],
      testResult: {
        success: false,
        statusCode: 503,
        error: "receiver returned status 503",
      },
    });

    await sendTest();

    expect(
      await screen.findByText("The receiver responded with status 503.")
    ).toBeTruthy();
    expect(screen.getByText("receiver returned status 503")).toBeTruthy();
    expect(screen.queryByText(/webhooks.tls/)).toBeNull();
  });

  it("points at the operator's TLS settings for a handshake failure", async () => {
    renderPage({
      webhooks: [webhook],
      testResult: {
        success: false,
        error:
          'Post "https://hooks.example.com": tls: failed to verify certificate: x509: certificate signed by unknown authority',
      },
    });

    await sendTest();

    expect(
      await screen.findByText("No response was received from the receiver.")
    ).toBeTruthy();
    expect(screen.getByText("webhooks.tls")).toBeTruthy();
  });

  it("says a disabled webhook receives only test events", async () => {
    renderPage({ webhooks: [{ ...webhook, enabled: false }] });

    fireEvent.click(screen.getByRole("button", { name: "Test" }));

    expect(await screen.findByText(/This webhook is disabled/)).toBeTruthy();
  });

  it("reports a test request the portal server refused", async () => {
    renderPage({
      webhooks: [webhook],
      testError: new HttpError("Not found", 404),
    });

    await sendTest();

    expect(
      await screen.findByText(/The test could not be sent. Not found/)
    ).toBeTruthy();
  });
});

describe("getWebhookUrlError", () => {
  it.each([
    "https://example.com/hook",
    "http://receiver.svc:8080/?token=x",
    "HTTPS://Example.com/hook",
    "http://[::1]:8080/hook",
    "https://user:secret@example.com/hook",
  ])("accepts %s", (url) => {
    expect(getWebhookUrlError(url)).toBeUndefined();
  });

  // The last five are URLs the browser's parser repairs and accepts, but the
  // server's rejects.
  it.each([
    ["a relative path", "/hooks/portal"],
    ["a non-http scheme", "ftp://example.com"],
    ["a URL without a host", "http://"],
    ["a URL without the slashes", "https:example.com"],
    ["a URL with an extra slash", "http:///example.com"],
    ["a URL with a backslash", "https://example.com\\hook"],
    ["a URL with a tab", "https://exa\tmple.com"],
    ["a URL with a space", "https://example.com/a b"],
  ])("rejects %s", (_, url) => {
    expect(getWebhookUrlError(url)).toBeDefined();
  });
});

describe("getTestRequestBodyError", () => {
  it.each([DEFAULT_TEST_REQUEST_BODY, "{}", '{"type": "x", "extra": 1}'])(
    "accepts %s",
    (body) => {
      expect(getTestRequestBodyError(body)).toBeUndefined();
    }
  );

  it.each(["", "{", "[]", "null", '"portal.subscription.created"'])(
    "rejects %s",
    (body) => {
      expect(getTestRequestBodyError(body)).toBeDefined();
    }
  );
});

describe("isTlsError", () => {
  it.each([
    "tls: failed to verify certificate: x509: certificate signed by unknown authority",
    "remote error: tls: certificate required",
  ])("recognizes %s", (error) => {
    expect(isTlsError(error)).toBe(true);
  });

  it.each(["receiver returned status 500", "context deadline exceeded"])(
    "does not flag %s",
    (error) => {
      expect(isTlsError(error)).toBe(false);
    }
  );
});
