import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `user_variables.tmplr.ts` reads its values once, at module-import time, from
 * the `insertedEnvironmentVariables` global that the server injects into the
 * built UI. So each case sets that global and re-imports the module.
 */
async function loadWithEnv(env: Record<string, string | undefined>) {
  (window as any).insertedEnvironmentVariables = Object.fromEntries(
    Object.entries(env).filter(([, value]) => value !== undefined),
  );
  vi.resetModules();
  return await import("./user_variables.tmplr");
}

async function loadWithAppliedOidcAuthCodeConfig(value: string | undefined) {
  return await loadWithEnv({ VITE_APPLIED_OIDC_AUTH_CODE_CONFIG: value });
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

describe("apiPageReload", () => {
  it.each([
    ["true", true],
    ["false", false],
    ["1", true],
    ["0", false],
    ["TRUE", true],
  ])("reads %o as %o", async (rawValue, expected) => {
    const { apiPageReload } = await loadWithEnv({
      VITE_API_PAGE_RELOAD: rawValue,
    });
    expect(apiPageReload).toBe(expected);
  });

  it("is off when unset", async () => {
    const { apiPageReload } = await loadWithEnv({});
    expect(apiPageReload).toBe(false);
  });

  it("records a config error for a value that is not a boolean", async () => {
    const { configErrors } = await loadWithEnv({
      VITE_API_PAGE_RELOAD: "yes",
    });
    expect(configErrors).toEqual([
      'VITE_API_PAGE_RELOAD must be "true" or "false", but was "yes".',
    ]);
  });
});

describe("defaultAppAuthMethod", () => {
  it.each([
    ["OAUTH", "OAUTH"],
    ["API_KEY", "API_KEY"],
    ["ALL", "ALL"],
    // Case is normalized, as it was before this was validated.
    ["oauth", "OAUTH"],
  ])("reads %o as %o", async (rawValue, expected) => {
    const { defaultAppAuthMethod } = await loadWithEnv({
      VITE_DEFAULT_APP_AUTH: rawValue,
    });
    expect(defaultAppAuthMethod).toBe(expected);
  });

  it("defaults to ALL when unset", async () => {
    const { defaultAppAuthMethod } = await loadWithEnv({});
    expect(defaultAppAuthMethod).toBe("ALL");
  });

  it("records a config error for an unknown method", async () => {
    const { configErrors } = await loadWithEnv({
      VITE_DEFAULT_APP_AUTH: "PASSWORD",
    });
    expect(configErrors).toEqual([
      'VITE_DEFAULT_APP_AUTH must be one of "ALL", "OAUTH", "API_KEY", but was "PASSWORD".',
    ]);
  });
});

describe("sessionExpiredBehavior", () => {
  it.each([
    ["anonymous", "anonymous"],
    ["prompt-login", "prompt-login"],
    ["PROMPT-LOGIN", "prompt-login"],
  ])("reads %o as %o", async (rawValue, expected) => {
    const { sessionExpiredBehavior } = await loadWithEnv({
      VITE_SESSION_EXPIRED_BEHAVIOR: rawValue,
    });
    expect(sessionExpiredBehavior).toBe(expected);
  });

  it("defaults to anonymous when unset", async () => {
    const { sessionExpiredBehavior } = await loadWithEnv({});
    expect(sessionExpiredBehavior).toBe("anonymous");
  });

  it("records a config error for an unknown behavior", async () => {
    const { configErrors } = await loadWithEnv({
      VITE_SESSION_EXPIRED_BEHAVIOR: "logout",
    });
    expect(configErrors).toEqual([
      'VITE_SESSION_EXPIRED_BEHAVIOR must be one of "anonymous", "prompt-login", but was "logout".',
    ]);
  });
});

describe("configErrors", () => {
  it("collects every misconfigured variable, not just the first", async () => {
    const { configErrors } = await loadWithEnv({
      VITE_APPLIED_OIDC_AUTH_CODE_CONFIG: "ture",
      VITE_API_PAGE_RELOAD: "yes",
      VITE_SESSION_EXPIRED_BEHAVIOR: "logout",
    });
    expect(configErrors).toHaveLength(3);
  });
});
