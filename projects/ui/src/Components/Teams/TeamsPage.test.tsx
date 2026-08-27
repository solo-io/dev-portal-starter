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
});
