import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TeamsPage } from "./TeamsPage";

// The page and its create-team modal read the team list and the create
// mutation on render. Neither is what these tests are about.
vi.mock("../../Apis/gg_hooks", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useListTeams: () => ({ isLoading: false, data: [] }),
  useCreateTeamMutation: () => ({ trigger: vi.fn() }),
}));

const auth = vi.hoisted(() => ({ isAdmin: true }));
vi.mock("../../Context/AuthContext", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useIsAdmin: () => auth.isAdmin,
}));

afterEach(() => {
  cleanup();
});

// TeamsPage is also served as /admin/teams (AdminTeamsPage re-exports it), so
// this covers the admin teams page as well as the self-service one.
describe("TeamsPage", () => {
  it("offers team creation to admins", () => {
    auth.isAdmin = true;
    render(
      <MemoryRouter>
        <TeamsPage />
      </MemoryRouter>,
    );

    expect(screen.queryByText("CREATE NEW TEAM")).not.toBeNull();
  });

  it("offers team creation to non-admins", () => {
    auth.isAdmin = false;
    render(
      <MemoryRouter>
        <TeamsPage />
      </MemoryRouter>,
    );

    expect(screen.queryByText("CREATE NEW TEAM")).not.toBeNull();
  });

  // The portal server scopes the list to the caller's mode, not the URL, so
  // an admin on /teams still sees every team. The copy must say so.
  it("says the list covers the whole portal for admins", () => {
    auth.isAdmin = true;
    render(
      <MemoryRouter initialEntries={["/admin/teams"]}>
        <TeamsPage />
      </MemoryRouter>,
    );

    expect(
      screen.queryByText("Browse all teams in this portal."),
    ).not.toBeNull();
  });

  it("says the list covers the whole portal for admins on /teams too", () => {
    auth.isAdmin = true;
    render(
      <MemoryRouter initialEntries={["/teams"]}>
        <TeamsPage />
      </MemoryRouter>,
    );

    expect(
      screen.queryByText("Browse all teams in this portal."),
    ).not.toBeNull();
    expect(screen.queryByText("Browse the teams you belong to.")).toBeNull();
  });

  it("says the list is membership-scoped for non-admins", () => {
    auth.isAdmin = false;
    render(
      <MemoryRouter initialEntries={["/teams"]}>
        <TeamsPage />
      </MemoryRouter>,
    );

    expect(
      screen.queryByText("Browse the teams you belong to."),
    ).not.toBeNull();
    expect(screen.queryByText("Browse all teams in this portal.")).toBeNull();
  });

  // The route alone must not move the copy.
  it("keeps the membership-scoped copy for a non-admin on the admin route", () => {
    auth.isAdmin = false;
    render(
      <MemoryRouter initialEntries={["/admin/teams"]}>
        <TeamsPage />
      </MemoryRouter>,
    );

    expect(
      screen.queryByText("Browse the teams you belong to."),
    ).not.toBeNull();
  });
});
