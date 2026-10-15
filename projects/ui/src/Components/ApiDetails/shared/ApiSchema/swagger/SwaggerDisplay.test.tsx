import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiVersionSchema } from "../../../../../Apis/api-types";
import { AuthContext } from "../../../../../Context/AuthContext";
import { SwaggerDisplay } from "./SwaggerDisplay";

// The constructor records its calls on `globalThis` because a `vi.mock` factory
// is hoisted above the module's own bindings and so cannot close over one.
declare global {
  // eslint-disable-next-line no-var
  var __swaggerConstructorCalls: unknown[][];
  // eslint-disable-next-line no-var
  var __preauthorizeApiKeyCalls: unknown[][];
}

vi.mock("swagger-ui", () => ({
  default: (...args: unknown[]) => {
    globalThis.__swaggerConstructorCalls.push(args);
    return {
      preauthorizeApiKey: (...args: unknown[]) =>
        globalThis.__preauthorizeApiKeyCalls.push(args),
      initOAuth: () => undefined,
      preauthorizeBasic: () => undefined,
    };
  },
}));

vi.mock("../../../../../user_variables.tmplr", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  swaggerPrefillApiKey: {
    authDefinitionKey: "bearer",
    apiKeyValue: "Bearer {{USER_TOKEN}}",
  },
}));

const spec: ApiVersionSchema = {
  info: { title: "Pets", version: "1.0.0" },
  paths: { "/pets": {} },
};

beforeEach(() => {
  globalThis.__swaggerConstructorCalls = [];
  globalThis.__preauthorizeApiKeyCalls = [];
});

afterEach(() => {
  cleanup();
});

describe("SwaggerDisplay", () => {
  it("does not rebuild when an equal spec arrives as a new object", () => {
    const { rerender } = render(
      <SwaggerDisplay apiVersionSpec={spec} apiVersionId="v1" />
    );
    expect(globalThis.__swaggerConstructorCalls).toHaveLength(1);

    rerender(
      <SwaggerDisplay
        apiVersionSpec={JSON.parse(JSON.stringify(spec))}
        apiVersionId="v1"
      />
    );

    expect(globalThis.__swaggerConstructorCalls).toHaveLength(1);
  });

  it("rebuilds when the spec actually changes", () => {
    const { rerender } = render(
      <SwaggerDisplay apiVersionSpec={spec} apiVersionId="v1" />
    );

    rerender(
      <SwaggerDisplay
        apiVersionSpec={{ ...spec, paths: { "/pets": {}, "/owners": {} } }}
        apiVersionId="v1"
      />
    );

    expect(globalThis.__swaggerConstructorCalls).toHaveLength(2);
  });

  it("reapplies the API key prefill without rebuilding when the token refreshes", () => {
    const withToken = (access_token: string) => (
      <AuthContext.Provider value={{ tokensResponse: { access_token } } as any}>
        <SwaggerDisplay apiVersionSpec={spec} apiVersionId="v1" />
      </AuthContext.Provider>
    );
    const { rerender } = render(withToken("first"));

    rerender(withToken("refreshed"));

    expect(globalThis.__swaggerConstructorCalls).toHaveLength(1);
    expect(globalThis.__preauthorizeApiKeyCalls).toEqual([
      ["bearer", "Bearer first"],
      ["bearer", "Bearer refreshed"],
    ]);
  });
});
