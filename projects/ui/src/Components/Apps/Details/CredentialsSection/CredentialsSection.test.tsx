import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import AddCredentialSubSection from "./AddCredentialSubSection";
import CredentialsSection from "./CredentialsSection";

type Token = { id: string; name: string; serial: string; createdAt: string };

const token: Token = {
  id: "token_1",
  name: "My Token",
  serial: "SN-42",
  createdAt: "2026-01-02T00:00:00Z",
};

/**
 * Renders the section for a made-up credential kind. `loading` is a list
 * request still in flight; with an `error`, it failed and there is no data.
 * `deleted` and `created` record what the delete confirmation and the create
 * form submitted.
 */
function renderSection({
  credentials = [] as Token[],
  loading = false,
  error = undefined as unknown,
} = {}) {
  const deleted: Token[] = [];
  const created: string[] = [];
  const { container } = render(
    <CredentialsSection
      kind="Token"
      credentials={loading || error ? undefined : credentials}
      error={error}
      columns={[{ header: "Serial", cell: (t) => t.serial }]}
      deleteCredential={async (t) => {
        deleted.push(t);
      }}
      renderAddSubSection={(open, onClose) => (
        <AddCredentialSubSection<Token>
          kind="Token"
          open={open}
          onClose={onClose}
          create={async (name) => {
            created.push(name);
            return { ...token, name };
          }}
          renderCreated={(t, onDone) =>
            t ? (
              <div>
                Created token {t.name}
                <button onClick={onDone}>Done</button>
              </div>
            ) : null
          }
        />
      )}
    />
  );
  return { container, deleted, created };
}

afterEach(() => {
  cleanup();
});

describe("CredentialsSection", () => {
  it("lists each credential with the extra columns between name and date", () => {
    renderSection({ credentials: [token] });

    expect(screen.getByText("My Token")).toBeTruthy();
    expect(screen.getByText("SN-42")).toBeTruthy();
    const headers = screen
      .getAllByRole("columnheader")
      .map((th) => th.textContent);
    expect(headers).toEqual(["Name", "Serial", "Created", "Delete"]);
  });

  it("shows only a loading indicator while the list is loading", () => {
    const { container } = renderSection({ loading: true });

    expect(container.innerHTML).not.toBe("");
    expect(screen.queryByText("Tokens")).toBeNull();
  });

  it("shows the empty state when there are no credentials", () => {
    renderSection();

    expect(screen.getByText("No Tokens were found.")).toBeTruthy();
  });

  it("says the list could not be loaded when the request fails", () => {
    renderSection({ error: new Error("upstream unavailable") });

    expect(screen.getByText("The Tokens could not be loaded.")).toBeTruthy();
    expect(screen.getByText("upstream unavailable")).toBeTruthy();
  });

  it("names and describes the credential it is about to delete", async () => {
    const { deleted } = renderSection({ credentials: [token] });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(await screen.findByText(/delete the Token "My Token"/)).toBeTruthy();
    expect(screen.getByText("Serial: SN-42")).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Delete Token" }));
    });
    expect(deleted).toEqual([token]);
  });

  it("creates a credential from the form and shows the result until done", async () => {
    const { created } = renderSection();

    fireEvent.click(screen.getByText(/ADD TOKEN/));
    fireEvent.change(screen.getByLabelText("token name"), {
      target: { value: "New Token" },
    });
    await act(async () => {
      fireEvent.click(screen.getByText("ADD Token"));
    });

    expect(created).toEqual(["New Token"]);
    expect(screen.getByText("Created token New Token")).toBeTruthy();

    fireEvent.click(screen.getByText("Done"));
    expect(screen.queryByText("Created token New Token")).toBeNull();
  });
});
