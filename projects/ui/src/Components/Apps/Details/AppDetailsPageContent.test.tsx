import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "../../../Apis/api-types";
import { AppDetailsPageContent } from "./AppDetailsPageContent";

// The sections below the banner fetch subscriptions, teams, keys and
// credentials; the breadcrumb is what these tests are about.
vi.mock("../../../Apis/gg_hooks", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useListSubscriptionsForApp: () => ({ isLoading: false, data: [] }),
  useListTeams: () => ({ isLoading: false, data: [] }),
  useListApiKeysForApp: () => ({ isLoading: false, data: [] }),
  useGetOAuthCredentialForApp: () => ({ isLoading: false, data: undefined }),
  useListApiProducts: () => ({ isLoading: false, data: [] }),
}));

const auth = vi.hoisted(() => ({ isAdmin: false }));
vi.mock("../../../Context/AuthContext", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useIsAdmin: () => auth.isAdmin,
}));

const app: App = {
  id: "app-123",
  name: "Test App",
  description: "An app",
  teamId: "team-456",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  deletedAt: "",
};

/** The breadcrumb link labelled "Apps", if rendered. */
function appsCrumb() {
  return screen
    .queryAllByRole("link")
    .find((el) => el.textContent?.trim() === "Apps");
}

function renderDetails() {
  return render(
    <MemoryRouter initialEntries={["/apps/app-123"]}>
      <AppDetailsPageContent app={app} />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

// App details are served at /apps/:appId for admins and non-admins alike, so
// the crumb follows the caller's mode rather than the URL.
describe("AppDetailsPageContent breadcrumb", () => {
  it("sends admins back to the admin apps list", () => {
    auth.isAdmin = true;
    renderDetails();

    expect(appsCrumb()?.getAttribute("href")).toBe("/admin/apps");
  });

  it("sends non-admins back to the self-service apps list", () => {
    auth.isAdmin = false;
    renderDetails();

    expect(appsCrumb()?.getAttribute("href")).toBe("/apps");
  });
});
