import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ConfigErrorPage } from "./ConfigErrorPage";

afterEach(cleanup);

describe("ConfigErrorPage", () => {
  it("names every misconfigured variable and what was wrong with it", () => {
    render(
      <ConfigErrorPage
        errors={[
          'VITE_APPLIED_OIDC_AUTH_CODE_CONFIG must be "true" or "false", but was "ture".',
          'VITE_SOMETHING_ELSE must be "true" or "false", but was "nope".',
        ]}
      />,
    );
    const listed = screen.getAllByRole("listitem").map((el) => el.textContent);
    expect(listed).toEqual([
      'VITE_APPLIED_OIDC_AUTH_CODE_CONFIG must be "true" or "false", but was "ture".',
      'VITE_SOMETHING_ELSE must be "true" or "false", but was "nope".',
    ]);
  });

  it("says the portal did not start, so the screen is not mistaken for a failed request", () => {
    render(<ConfigErrorPage errors={["VITE_X is bad."]} />);
    expect(
      screen.getByRole("heading", { name: /configuration/i }),
    ).toBeTruthy();
    expect(document.body.textContent).toContain("did not start");
  });
});
