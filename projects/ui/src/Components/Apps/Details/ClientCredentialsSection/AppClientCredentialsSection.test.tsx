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

import {
  App,
  ClientCredential,
  ClientCredentialWithSecret,
} from "../../../../Apis/api-types";
import {
  useCreateClientCredentialMutation,
  useDeleteClientCredentialMutation,
  useListClientCredentialsForApp,
} from "../../../../Apis/gg_hooks";
import { HttpError } from "../../../../Apis/utility";
import AppClientCredentialsSection from "./AppClientCredentialsSection";

const app: App = {
  id: "app-123",
  name: "Test App",
  description: "An app",
  teamId: "team-456",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  deletedAt: "",
};

const credential: ClientCredential = {
  id: "clientcred_1",
  appId: app.id,
  clientId: "abc123",
  name: "My Credential",
  source: "portal-issued",
  createdAt: "2026-01-02T00:00:00Z",
};

/**
 * Renders the section with its data hooks replaced. With an `error`, the list
 * request failed and, as with SWR, there is no data. `createArgs` and
 * `deleteArgs` record what the create form and the delete button submitted.
 */
function renderSection({
  credentials = [] as ClientCredential[],
  error = undefined as unknown,
  created = undefined as ClientCredentialWithSecret | undefined,
} = {}) {
  const createArgs: { name: string }[] = [];
  const deleteArgs: { clientCredentialId: string }[] = [];
  const { container } = render(
    <DiProvider
      use={[
        injectable(useListClientCredentialsForApp, () => ({
          isLoading: false,
          data: error ? undefined : credentials,
          error,
        })),
        injectable(useCreateClientCredentialMutation, () => ({
          trigger: async (arg: { name: string }) => {
            createArgs.push(arg);
            return created;
          },
        })),
        injectable(useDeleteClientCredentialMutation, () => ({
          trigger: async (arg: { clientCredentialId: string }) => {
            deleteArgs.push(arg);
          },
        })),
      ]}
    >
      <AppClientCredentialsSection app={app} />
    </DiProvider>
  );
  return { container, createArgs, deleteArgs };
}

afterEach(() => {
  cleanup();
});

describe("AppClientCredentialsSection", () => {
  it("lists the client ID of each credential", () => {
    renderSection({ credentials: [credential] });

    expect(screen.getByText("My Credential")).toBeTruthy();
    expect(screen.getByText("abc123")).toBeTruthy();
  });

  it("shows the empty state when the app has no credentials", () => {
    renderSection();

    expect(screen.getByText("No Client Credentials were found.")).toBeTruthy();
  });

  // Without the route, the server has no client credentials to offer.
  it("renders nothing when the server has no client credentials route", () => {
    const { container } = renderSection({
      error: new HttpError("Not found", 404),
    });

    expect(container.innerHTML).toBe("");
  });

  it("says the list could not be loaded when the request fails", () => {
    renderSection({
      error: new HttpError("upstream unavailable", 503),
    });

    expect(
      screen.getByText("The Client Credentials could not be loaded.")
    ).toBeTruthy();
    expect(screen.getByText("upstream unavailable")).toBeTruthy();
  });

  it("names the credential it is about to delete", async () => {
    const { deleteArgs } = renderSection({ credentials: [credential] });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      await screen.findByText(/delete the Client Credential "My Credential"/)
    ).toBeTruthy();
    expect(screen.getByText("Client ID: abc123")).toBeTruthy();

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Delete Client Credential" })
      );
    });
    expect(deleteArgs).toEqual([{ clientCredentialId: credential.id }]);
  });

  // The secret comes back only from the create call, so the reveal modal is
  // the one chance the user has to copy it.
  it("reveals the client ID and secret once after creating", async () => {
    const { createArgs } = renderSection({
      created: { ...credential, clientSecret: "s3cret" },
    });

    fireEvent.click(screen.getByText(/ADD CLIENT CREDENTIAL/));
    fireEvent.change(screen.getByLabelText("client credential name"), {
      target: { value: "My Credential" },
    });
    await act(async () => {
      fireEvent.click(screen.getByText("ADD Client Credential"));
    });

    expect(createArgs).toEqual([{ name: "My Credential" }]);
    await waitFor(() => {
      expect(screen.getByText("Created Client Credential")).toBeTruthy();
    });
    expect(screen.getByText("abc123")).toBeTruthy();
    expect(screen.getByText("s3cret")).toBeTruthy();
  });
});
