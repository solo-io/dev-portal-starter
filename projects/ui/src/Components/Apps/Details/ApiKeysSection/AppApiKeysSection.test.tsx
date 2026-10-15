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
 * Renders the section with its data hooks replaced. `createArgs` and
 * `deleteArgs` record what the create form and the delete button submitted.
 */
function renderSection({
  apiKeys = [] as ApiKey[],
  created = undefined as ApiKey | undefined,
} = {}) {
  const createArgs: { apiKeyName: string }[] = [];
  const deleteArgs: { apiKeyId: string }[] = [];
  render(
    <DiProvider
      use={[
        injectable(useListApiKeysForApp, () => ({
          isLoading: false,
          data: apiKeys,
          error: undefined,
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
  return { createArgs, deleteArgs };
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

  it("creates a key by name and reveals it", async () => {
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

  it("deletes a key by id", async () => {
    const { deleteArgs } = renderSection({ apiKeys: [apiKey] });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    await act(async () => {
      fireEvent.click(
        await screen.findByRole("button", { name: "Delete API Key" })
      );
    });

    expect(deleteArgs).toEqual([{ apiKeyId: apiKey.id }]);
  });
});
