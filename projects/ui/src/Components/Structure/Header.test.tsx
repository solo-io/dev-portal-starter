import { cleanup, render, screen } from "@testing-library/react";
import { ContextType } from "react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppContext } from "../../Context/AppContext";
import Header from "./Header";

// `useIsAdmin` / `useIsLoggedIn` read from AuthContext, which needs tokens and
// a /me request to resolve. These tests are about which nav entries the header
// renders for a given identity, so the identity is stubbed directly.
const auth = vi.hoisted(() => ({ isAdmin: false, isLoggedIn: true }));
vi.mock("../../Context/AuthContext", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useIsAdmin: () => auth.isAdmin,
  useIsLoggedIn: () => auth.isLoggedIn,
}));

/**
 * AppContext's default value is `{}`, so `portalServerType` would be
 * undefined and the header would render neither the gloo-gateway nor the
 * gloo-mesh-gateway branch. Tests have to supply it.
 */
function renderHeader(path: string) {
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
        <Header />
      </MemoryRouter>
    </AppContext.Provider>,
  );
}

/** The nav link with this exact text, or undefined if it isn't rendered. */
function navLink(text: string) {
  return screen
    .queryAllByRole("link")
    .find((el) => el.textContent?.trim() === text);
}

beforeEach(() => {
  auth.isAdmin = false;
  auth.isLoggedIn = true;
});

afterEach(() => {
  cleanup();
});

describe("Header nav for admin users", () => {
  beforeEach(() => {
    auth.isAdmin = true;
  });

  it("offers the APIs catalog alongside the admin entries", () => {
    renderHeader("/admin/apps");

    expect(navLink("APIs")).toBeDefined();
    expect(navLink("Teams")).toBeDefined();
    expect(navLink("Apps")).toBeDefined();
    expect(navLink("Subscriptions")).toBeDefined();
  });

  it("points Teams and Apps at the admin routes", () => {
    renderHeader("/admin/apps");

    expect(navLink("Teams")?.getAttribute("href")).toBe("/admin/teams");
    expect(navLink("Apps")?.getAttribute("href")).toBe("/admin/apps");
  });

  // App and team details live at /apps/:id and /teams/:id for admins as well,
  // so the tab has to stay highlighted outside the /admin/* path.
  it("keeps Apps active on an app details page", () => {
    renderHeader("/apps/app-123");

    expect(navLink("Apps")?.className).toContain("active");
  });

  it("keeps Teams active on a team details page", () => {
    renderHeader("/teams/team-123");

    expect(navLink("Teams")?.className).toContain("active");
  });

  it("still marks Apps active on the admin apps list", () => {
    renderHeader("/admin/apps");

    expect(navLink("Apps")?.className).toContain("active");
  });
});

describe("Header nav for non-admin users", () => {
  it("offers the self-service entries and no admin entries", () => {
    auth.isAdmin = false;
    renderHeader("/apis");

    expect(navLink("APIs")).toBeDefined();
    expect(navLink("Teams")?.getAttribute("href")).toBe("/teams");
    expect(navLink("Apps")?.getAttribute("href")).toBe("/apps");
    expect(navLink("Subscriptions")).toBeUndefined();
  });
});

describe("Header nav when logged out", () => {
  it("offers only the APIs catalog", () => {
    auth.isLoggedIn = false;
    renderHeader("/apis");

    expect(navLink("APIs")).toBeDefined();
    expect(navLink("Teams")).toBeUndefined();
    expect(navLink("Apps")).toBeUndefined();
  });
});
