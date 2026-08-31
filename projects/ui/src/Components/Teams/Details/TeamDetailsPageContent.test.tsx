import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Team } from "../../../Apis/api-types";
import TeamDetailsPageContent from "./TeamDetailsPageContent";

// The sections below the banner fetch the team's apps and members; the
// breadcrumb is what these tests are about.
vi.mock("../../../Apis/gg_hooks", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useListAppsForTeam: () => ({ isLoading: false, data: [] }),
  useListUsersForTeam: () => ({ isLoading: false, data: [] }),
  useListTeamMembers: () => ({ isLoading: false, data: [] }),
}));

const auth = vi.hoisted(() => ({ isAdmin: false }));
vi.mock("../../../Context/AuthContext", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useIsAdmin: () => auth.isAdmin,
}));

const team: Team = {
  id: "team-456",
  name: "Test Team",
  description: "A team",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

/** The breadcrumb link labelled "Teams", if rendered. */
function teamsCrumb() {
  return screen
    .queryAllByRole("link")
    .find((el) => el.textContent?.trim() === "Teams");
}

function renderDetails() {
  return render(
    <MemoryRouter initialEntries={["/teams/team-456"]}>
      <TeamDetailsPageContent team={team} />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

// Team details are served at /teams/:teamId for admins and non-admins alike.
// The crumb has to lead back to the list the caller's mode populates, or an
// admin lands on a page whose copy contradicts what the backend returned.
describe("TeamDetailsPageContent breadcrumb", () => {
  it("sends admins back to the admin teams list", () => {
    auth.isAdmin = true;
    renderDetails();

    expect(teamsCrumb()?.getAttribute("href")).toBe("/admin/teams");
  });

  it("sends non-admins back to the self-service teams list", () => {
    auth.isAdmin = false;
    renderDetails();

    expect(teamsCrumb()?.getAttribute("href")).toBe("/teams");
  });
});
