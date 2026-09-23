import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiVersionSchema } from "../../../../../Apis/api-types";
import { SwaggerDisplay } from "./SwaggerDisplay";

// The constructor records its calls on `globalThis` because a `vi.mock` factory
// is hoisted above the module's own bindings and so cannot close over one.
declare global {
  // eslint-disable-next-line no-var
  var __swaggerConstructorCalls: unknown[][];
}

vi.mock("swagger-ui", () => ({
  default: (...args: unknown[]) => {
    globalThis.__swaggerConstructorCalls.push(args);
    return {
      preauthorizeApiKey: () => undefined,
      initOAuth: () => undefined,
      preauthorizeBasic: () => undefined,
    };
  },
}));

const spec: ApiVersionSchema = {
  info: { title: "Pets", version: "1.0.0" },
  paths: { "/pets": {} },
};

beforeEach(() => {
  globalThis.__swaggerConstructorCalls = [];
});

afterEach(() => {
  cleanup();
});

describe("SwaggerDisplay", () => {
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
});
