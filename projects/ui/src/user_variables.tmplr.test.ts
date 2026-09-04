import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `user_variables.tmplr.ts` reads its values once, at module-import time, from
 * the `insertedEnvironmentVariables` global that the server injects into the
 * built UI. So each case sets that global and re-imports the module.
 */
async function loadWithAppliedOidcAuthCodeConfig(value: string | undefined) {
  (window as any).insertedEnvironmentVariables =
    value === undefined ? {} : { VITE_APPLIED_OIDC_AUTH_CODE_CONFIG: value };
  vi.resetModules();
  return await import("./user_variables.tmplr");
}

afterEach(() => {
  (window as any).insertedEnvironmentVariables = {};
});

describe("appliedOidcAuthCodeConfig", () => {
  it('is off when set to "false", selecting the PKCE flow', async () => {
    const { appliedOidcAuthCodeConfig } =
      await loadWithAppliedOidcAuthCodeConfig("false");
    expect(appliedOidcAuthCodeConfig).toBe(false);
  });

  it.each([
    ["true", true],
    ["1", true],
    ["false", false],
    ["0", false],
    // Case and surrounding whitespace survive a trip through a Kubernetes
    // manifest or a shell more easily than they survive a reader's attention.
    ["TRUE", true],
    ["  true  ", true],
    ["False", false],
  ])("reads %o as %o", async (rawValue, expected) => {
    const { appliedOidcAuthCodeConfig } =
      await loadWithAppliedOidcAuthCodeConfig(rawValue);
    expect(appliedOidcAuthCodeConfig).toBe(expected);
  });

  it.each([undefined, "", "   "])(
    "is off (PKCE) when unset or empty (%o)",
    async (rawValue) => {
      const { appliedOidcAuthCodeConfig } =
        await loadWithAppliedOidcAuthCodeConfig(rawValue);
      expect(appliedOidcAuthCodeConfig).toBe(false);
    },
  );
});

describe("configErrors", () => {
  it("records an error for a value that is neither true nor false", async () => {
    const { configErrors } = await loadWithAppliedOidcAuthCodeConfig("ture");
    expect(configErrors).toEqual([
      'VITE_APPLIED_OIDC_AUTH_CODE_CONFIG must be "true" or "false", but was "ture".',
    ]);
  });

  it("stays empty for a valid value", async () => {
    const { configErrors } = await loadWithAppliedOidcAuthCodeConfig("true");
    expect(configErrors).toEqual([]);
  });
});
