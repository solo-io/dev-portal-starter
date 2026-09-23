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

import { App, ClientId, ClientIdWithKey } from "../../../../Apis/api-types";
import {
  useCreateClientIdMutation,
  useDeleteClientIdMutation,
  useListClientIdsForApp,
} from "../../../../Apis/gg_hooks";
import AppClientIdsSection from "./AppClientIdsSection";

const app: App = {
  id: "app-123",
  name: "Test App",
  description: "An app",
  teamId: "team-456",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  deletedAt: "",
};

const clientId: ClientId = {
  id: "appcred_1",
  appId: app.id,
  clientId: "portal-abc123",
  name: "My Key",
  createdAt: "2026-01-02T00:00:00Z",
  keys: [
    {
      id: "appcredkey_1",
      source: "portal_issued",
      createdAt: "2026-01-02T00:00:00Z",
    },
  ],
};

/**
 * Renders the section with its data hooks replaced. With an `error`, the list
 * request failed and, as with SWR, there is no data. `createArgs` and
 * `deleteArgs` record what the create form and the delete button submitted.
 */
function renderSection({
  clientIds = [] as ClientId[],
  error = undefined as unknown,
  created = undefined as ClientIdWithKey | undefined,
} = {}) {
  const createArgs: { name: string }[] = [];
  const deleteArgs: { clientIdId: string }[] = [];
  const { container } = render(
    <DiProvider
      use={[
        injectable(useListClientIdsForApp, () => ({
          isLoading: false,
          data: error ? undefined : clientIds,
          error,
        })),
        injectable(useCreateClientIdMutation, () => ({
          trigger: async (arg: { name: string }) => {
            createArgs.push(arg);
            return created;
          },
        })),
        injectable(useDeleteClientIdMutation, () => ({
          trigger: async (arg: { clientIdId: string }) => {
            deleteArgs.push(arg);
          },
        })),
      ]}
    >
      <AppClientIdsSection app={app} />
    </DiProvider>
  );
  return { container, createArgs, deleteArgs };
}

afterEach(() => {
  cleanup();
});

describe("AppClientIdsSection", () => {
  it("lists each key by name and client ID", () => {
    renderSection({ clientIds: [clientId] });

    expect(screen.getByText("API Keys with Client ID")).toBeTruthy();
    expect(screen.getByText("My Key")).toBeTruthy();
    expect(screen.getByText("portal-abc123")).toBeTruthy();
  });

  it("shows the empty state when the app has no keys", () => {
    renderSection();

    expect(
      screen.getByText("No API Keys with Client ID were found.")
    ).toBeTruthy();
  });

  it("says the list could not be loaded when the request fails", () => {
    renderSection({ error: new Error("upstream unavailable") });

    expect(
      screen.getByText("The API Keys with Client ID could not be loaded.")
    ).toBeTruthy();
    expect(screen.getByText("upstream unavailable")).toBeTruthy();
  });

  it("names the key it is about to delete", async () => {
    const { deleteArgs } = renderSection({ clientIds: [clientId] });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      await screen.findByText(/delete the API Key with Client ID "My Key"/)
    ).toBeTruthy();
    expect(screen.getByText("Client ID: portal-abc123")).toBeTruthy();

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Delete API Key with Client ID" })
      );
    });
    expect(deleteArgs).toEqual([{ clientIdId: clientId.id }]);
  });

  // The API key comes back only from the create call, so the reveal modal is
  // the one chance the user has to copy it.
  it("reveals the client ID and API key once after creating", async () => {
    const { createArgs } = renderSection({
      created: { ...clientId, apiKey: "portal_cid_s3cret" },
    });

    fireEvent.click(screen.getByText(/ADD API KEY WITH CLIENT ID/));
    fireEvent.change(screen.getByLabelText("api key with client id name"), {
      target: { value: "My Key" },
    });
    await act(async () => {
      fireEvent.click(screen.getByText("ADD API Key with Client ID"));
    });

    expect(createArgs).toEqual([{ name: "My Key" }]);
    await waitFor(() => {
      expect(screen.getByText("Created API Key with Client ID")).toBeTruthy();
    });
    expect(screen.getByText("portal-abc123")).toBeTruthy();
    expect(screen.getByText("portal_cid_s3cret")).toBeTruthy();
  });
});
