import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppsPage } from "./AppsPage";

// The page lists apps per team, and the create-app modal reads the team list
// and the create mutation on render. Neither is what these tests are about.
vi.mock("../../Apis/gg_hooks", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useListTeams: () => ({ isLoading: false, data: [] }),
  useListAppsForTeams: () => ({ isLoading: false, data: [] }),
  useListFlatAppsForTeamsOmitErrors: () => ({ isLoading: false, data: [] }),
  useCreateAppMutation: () => ({ trigger: vi.fn() }),
}));

const auth = vi.hoisted(() => ({ isAdmin: true }));
vi.mock("../../Context/AuthContext", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useIsAdmin: () => auth.isAdmin,
}));

afterEach(() => {
  cleanup();
});

// AppsPage is also served as /admin/apps (AdminAppsPage re-exports it), so
// this covers the admin apps page as well as the self-service one.
describe("AppsPage", () => {
  it("offers app creation to admins", () => {
    auth.isAdmin = true;
    render(
      <MemoryRouter>
        <AppsPage />
      </MemoryRouter>,
    );

    expect(screen.queryByText("CREATE NEW APP")).not.toBeNull();
  });

  it("offers app creation to non-admins", () => {
    auth.isAdmin = false;
    render(
      <MemoryRouter>
        <AppsPage />
      </MemoryRouter>,
    );

    expect(screen.queryByText("CREATE NEW APP")).not.toBeNull();
  });

  // The list is scoped to the caller on /apps and covers the whole
  // portal on /admin/apps, so the wording has to distinguish them.
  it("says the list covers the whole portal on the admin route", () => {
    render(
      <MemoryRouter initialEntries={["/admin/apps"]}>
        <AppsPage />
      </MemoryRouter>,
    );

    expect(
      screen.queryByText("Browse all Apps in this portal."),
    ).not.toBeNull();
    expect(
      screen.queryByText("Browse the Apps of the teams you belong to."),
    ).toBeNull();
  });

  it("says the list is the caller's own on the self-service route", () => {
    render(
      <MemoryRouter initialEntries={["/apps"]}>
        <AppsPage />
      </MemoryRouter>,
    );

    expect(
      screen.queryByText("Browse the Apps of the teams you belong to."),
    ).not.toBeNull();
    expect(screen.queryByText("Browse all Apps in this portal.")).toBeNull();
  });
});
