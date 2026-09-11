import { cleanup, render, screen } from "@testing-library/react";
import { ContextType } from "react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppContext } from "../Context/AppContext";
import AppContentRoutes from "./AppContentRoutes";

// The routes ask AuthContext who is signed in, which would need tokens and a
// /me request. The PKCE callback is reached while signed out, by definition.
vi.mock("../Context/AuthContext", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useIsLoggedIn: () => false,
}));

afterEach(cleanup);

function renderRoutesAt(path: string) {
  return render(
    <AppContext.Provider
      value={
        {
          pageContentIsWide: false,
          portalServerType: "gloo-gateway",
        } as ContextType<typeof AppContext>
      }
    >
      <MemoryRouter initialEntries={[path]}>
        <AppContentRoutes />
      </MemoryRouter>
    </AppContext.Provider>,
  );
}

describe("the PKCE callback route", () => {
  it("tells the user a sign-in is in progress while the code is exchanged", () => {
    renderRoutesAt("/callback");
    expect(screen.getByText(/signing in/i)).toBeTruthy();
  });
});
