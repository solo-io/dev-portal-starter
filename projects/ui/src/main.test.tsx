import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// `BasicAuthHeaderSection`, reached through `main.tsx`'s import of `App`,
// console.errors at import time when the page is not a secure context, which
// jsdom never is. Nothing here depends on the crypto APIs that warning is
// about, so report a secure context and keep the test output clean.
Object.defineProperty(window, "isSecureContext", {
  configurable: true,
  value: true,
});

/**
 * `main.tsx` mounts the app as a side effect of being imported, so each case
 * sets up the injected environment and a mount point, then re-imports it.
 */
async function bootWithAppliedOidcAuthCodeConfig(value: string) {
  (window as any).insertedEnvironmentVariables = {
    VITE_APPLIED_OIDC_AUTH_CODE_CONFIG: value,
  };
  document.body.innerHTML = '<div id="root"></div>';
  vi.resetModules();
  await import("./main");
}

afterEach(() => {
  (window as any).insertedEnvironmentVariables = {};
  document.body.innerHTML = "";
});

describe("startup", () => {
  it("refuses to start and reports the variable when it is misconfigured", async () => {
    await bootWithAppliedOidcAuthCodeConfig("ture");
    expect(await screen.findByText(/Portal configuration error/)).toBeTruthy();
    expect(document.body.textContent).toContain(
      "VITE_APPLIED_OIDC_AUTH_CODE_CONFIG",
    );
  });
});
