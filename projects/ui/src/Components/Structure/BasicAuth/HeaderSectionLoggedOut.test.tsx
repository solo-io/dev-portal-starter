import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { ContextType } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  AuthContext,
  LOCAL_STORAGE_AUTH_STATE,
  LOCAL_STORAGE_AUTH_VERIFIER,
} from "../../../Context/AuthContext";
import { doAccessTokenRequest } from "../../../Utility/accessTokenRequest";
import HeaderSectionLoggedOut from "./HeaderSectionLoggedOut";

// The token exchange is the network call under test; each case decides whether
// the identity provider accepts the code.
vi.mock("../../../Utility/accessTokenRequest", () => ({
  doAccessTokenRequest: vi.fn(),
}));

vi.mock("../../../Context/AuthContext", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useIsLoggedIn: () => false,
}));

/** Renders the current path so navigation is observable. */
function CurrentPath() {
  return <div data-testid="path">{useLocation().pathname}</div>;
}

function renderAt(url: string) {
  return render(
    <AuthContext.Provider
      value={{ onLogin: vi.fn() } as unknown as ContextType<typeof AuthContext>}
    >
      <MemoryRouter initialEntries={[url]}>
        <CurrentPath />
        <HeaderSectionLoggedOut />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("an auth code that cannot be exchanged", () => {
  it("returns the user to the app rather than leaving them on the callback route", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    // A state that does not match what login stored: the code is unusable.
    localStorage.setItem(LOCAL_STORAGE_AUTH_STATE, "the-state-we-sent");
    localStorage.setItem(LOCAL_STORAGE_AUTH_VERIFIER, "verifier");

    renderAt("/callback?code=abc123&state=some-other-state");

    await waitFor(() =>
      expect(screen.getByTestId("path").textContent).toBe("/"),
    );
  });
});

describe("a token endpoint that rejects the exchange", () => {
  it("returns the user to the app rather than leaving them on the callback route", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    // Everything the app checks locally is in order; the identity provider is
    // the one refusing (an invalid_grant, e.g. a redirect_uri mismatch).
    localStorage.setItem(LOCAL_STORAGE_AUTH_STATE, "the-state-we-sent");
    localStorage.setItem(LOCAL_STORAGE_AUTH_VERIFIER, "verifier");
    vi.mocked(doAccessTokenRequest).mockRejectedValue(
      new Error("invalid_grant"),
    );

    renderAt("/callback?code=abc123&state=the-state-we-sent");

    await waitFor(() =>
      expect(screen.getByTestId("path").textContent).toBe("/"),
    );
  });
});
