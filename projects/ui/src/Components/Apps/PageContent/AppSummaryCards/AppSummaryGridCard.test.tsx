import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppWithTeam } from "../AppsList";
import { AppSummaryGridCard } from "./AppSummaryGridCard";

const auth = vi.hoisted(() => ({ isAdmin: true }));
vi.mock("../../../../Context/AuthContext", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useIsAdmin: () => auth.isAdmin,
}));

const app: AppWithTeam = {
  id: "app-123",
  name: "Test App",
  description: "An app",
  teamId: "team-456",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  deletedAt: "",
  team: {
    id: "team-456",
    name: "Test Team",
    description: "A team",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
};

function renderCard() {
  return render(
    <MemoryRouter>
      <AppSummaryGridCard app={app} />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe("AppSummaryGridCard", () => {
  // Without this link an admin can see every app but open none of them, which
  // also puts app deletion and credential management out of reach.
  it("links admins to the app details page", () => {
    auth.isAdmin = true;
    renderCard();

    const details = screen.queryByText("DETAILS");
    expect(details).not.toBeNull();
    expect(details?.getAttribute("href")).toBe("/apps/app-123");
  });

  it("links non-admins to the app details page", () => {
    auth.isAdmin = false;
    renderCard();

    expect(screen.queryByText("DETAILS")?.getAttribute("href")).toBe(
      "/apps/app-123",
    );
  });
});
