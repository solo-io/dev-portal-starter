import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { DiProvider, injectable } from "react-magnetic-di";
import { afterEach, describe, expect, it } from "vitest";

import { ApiKey, App } from "../../../../Apis/api-types";
import {
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
  useListApiKeysForApp,
} from "../../../../Apis/gg_hooks";
import { HttpError } from "../../../../Apis/utility";
import AppApiKeysSection from "./AppApiKeysSection";

const app: App = {
  id: "app-123",
  name: "Test App",
  description: "An app",
  teamId: "team-456",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  deletedAt: "",
};

const apiKey: ApiKey = {
  id: "apikey_1",
  name: "My Key",
  apiKey: "",
  createdAt: "2026-01-02T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
  deletedAt: "",
  metadata: {},
};

/**
 * Renders the section with its data hooks replaced. `loading` is a list
 * request still in flight; with an `error`, it failed and, as with SWR, there
 * is no data. `createArgs` and `deleteArgs` record what the create form and
 * the delete button submitted.
 */
function renderSection({
  apiKeys = [] as ApiKey[],
  loading = false,
  error = undefined as unknown,
  created = undefined as ApiKey | undefined,
} = {}) {
  const createArgs: { apiKeyName: string }[] = [];
  const deleteArgs: { apiKeyId: string }[] = [];
  const { container } = render(
    <DiProvider
      use={[
        injectable(useListApiKeysForApp, () => ({
          isLoading: loading,
          data: loading || error ? undefined : apiKeys,
          error,
        })),
        injectable(useCreateApiKeyMutation, () => ({
          trigger: async (arg: { apiKeyName: string }) => {
            createArgs.push(arg);
            return created;
          },
        })),
        injectable(useDeleteApiKeyMutation, () => ({
          trigger: async (arg: { apiKeyId: string }) => {
            deleteArgs.push(arg);
          },
        })),
      ]}
    >
      <AppApiKeysSection app={app} />
    </DiProvider>
  );
  return { container, createArgs, deleteArgs };
}

afterEach(() => {
  cleanup();
});

describe("AppApiKeysSection", () => {
  it("lists each key by name, with no columns beyond the shared ones", () => {
    renderSection({ apiKeys: [apiKey] });

    expect(screen.getByText("My Key")).toBeTruthy();
    const headers = screen
      .getAllByRole("columnheader")
      .map((th) => th.textContent);
    expect(headers).toEqual(["Name", "Created", "Delete"]);
  });

  it("shows the empty state when the app has no keys", () => {
    renderSection();

    expect(screen.getByText("No API Keys were found.")).toBeTruthy();
  });

  it("shows only a loading indicator while the list is loading", () => {
    const { container } = renderSection({ loading: true });

    expect(container.innerHTML).not.toBe("");
    expect(screen.queryByText("API Keys")).toBeNull();
    expect(screen.queryByText("No API Keys were found.")).toBeNull();
    expect(screen.queryByText(/could not be loaded/)).toBeNull();
  });

  // Unlike Client Credentials, the API key route is always there, so even a
  // 404 is a failure to report.
  it("says the list could not be loaded when the request fails", () => {
    renderSection({ error: new HttpError("Not found", 404) });

    expect(screen.getByText("The API Keys could not be loaded.")).toBeTruthy();
    expect(screen.getByText("Not found")).toBeTruthy();
  });

  it("reveals the key once after creating it", async () => {
    const { createArgs } = renderSection({
      created: { ...apiKey, apiKey: "k3y-value" },
    });

    fireEvent.click(screen.getByText(/ADD API KEY/));
    fireEvent.change(screen.getByLabelText("api key name"), {
      target: { value: "My Key" },
    });
    await act(async () => {
      fireEvent.click(screen.getByText("ADD API Key"));
    });

    expect(createArgs).toEqual([{ apiKeyName: "My Key" }]);
    await waitFor(() => {
      expect(screen.getByText("Created API Key")).toBeTruthy();
    });
    expect(screen.getByText("k3y-value")).toBeTruthy();
  });

  it("names the key it is about to delete", async () => {
    const { deleteArgs } = renderSection({ apiKeys: [apiKey] });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      await screen.findByText(/delete the API Key "My Key"/)
    ).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Delete API Key" }));
    });
    expect(deleteArgs).toEqual([{ apiKeyId: apiKey.id }]);
  });
});
