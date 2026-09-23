import { cleanup, render, screen } from "@testing-library/react";
import { List, Map, fromJS } from "immutable";
import { afterEach, describe, expect, it } from "vitest";

import { pairedApiKeyAuthPlugin } from "./pairedApiKeyAuthPlugin";

/** A spec whose operation names both schemes in one requirement (an AND). */
const pairedSpec = fromJS({
  openapi: "3.0.0",
  paths: {
    "/pets": {
      get: {
        security: [{ clientId: [], clientSecret: [] }],
      },
    },
  },
  components: {
    securitySchemes: {
      clientId: { type: "apiKey", name: "x-ibm-client-id", in: "header" },
      clientSecret: { type: "apiKey", name: "x-ibm-client-secret", in: "header" },
    },
  },
});

/** The same two schemes as alternatives (an OR), which must stay separate. */
const eitherOrSpec = fromJS({
  openapi: "3.0.0",
  paths: {
    "/pets": {
      get: {
        security: [{ clientId: [] }, { clientSecret: [] }],
      },
    },
  },
  components: {
    securitySchemes: {
      clientId: { type: "apiKey", name: "x-ibm-client-id", in: "header" },
      clientSecret: { type: "apiKey", name: "x-ibm-client-secret", in: "header" },
    },
  },
});

function systemFor(spec: unknown) {
  return { specSelectors: { specJson: () => spec } };
}

/** What Swagger UI's own selector returns: one scheme per entry. */
function stockDefinitions(spec: any) {
  const schemes = spec.getIn(["components", "securitySchemes"]);
  return schemes
    .entrySeq()
    .map(([name, schema]: [string, unknown]) => Map({ [name]: schema }))
    .toList();
}

function regroup(spec: any, onOriCall?: (args: unknown[]) => void) {
  const system = systemFor(spec);
  const wrap =
    pairedApiKeyAuthPlugin(system).statePlugins.auth.wrapSelectors
      .definitionsToAuthorize;
  const ori = (...args: unknown[]) => {
    onOriCall?.(args);
    return stockDefinitions(spec);
  };
  // Swagger UI hands the wrapper the auth substate ahead of the selector's own
  // arguments.
  return wrap(ori, system)(Map());
}

afterEach(() => {
  cleanup();
});

describe("definitionsToAuthorize grouping", () => {
  it("merges schemes named together into one entry, so they share a button", () => {
    const result = regroup(pairedSpec);

    expect(result.size).toBe(1);
    expect(result.first().keySeq().toArray()).toEqual([
      "clientId",
      "clientSecret",
    ]);
  });

  it("leaves alternative schemes in their own entries", () => {
    const result = regroup(eitherOrSpec);

    expect(result.size).toBe(2);
  });

  // `ori` is already bound to the auth state, so passing the state through
  // would shift every argument by one.
  it("calls the wrapped selector without the state it was handed", () => {
    const calls: unknown[][] = [];
    regroup(pairedSpec, (args) => calls.push(args));

    expect(calls).toEqual([[]]);
  });
});

const getComponent = (name: string) => {
  switch (name) {
    case "Input":
      return (props: any) => <input {...props} />;
    case "Markdown":
      return ({ source }: any) => <span>{source}</span>;
    case "authError":
    case "JumpToPath":
      return () => null;
    default:
      return ({ children }: any) => <div>{children}</div>;
  }
};

function renderAuthField(spec: any, name: string) {
  const system = systemFor(spec);
  const ApiKeyAuth = pairedApiKeyAuthPlugin(system).components.apiKeyAuth;
  render(
    <ApiKeyAuth
      schema={spec.getIn(["components", "securitySchemes", name])}
      name={name}
      getComponent={getComponent}
      errSelectors={{ allErrors: () => List() }}
      authSelectors={{ selectAuthPath: () => List() }}
      authorized={Map()}
      onChange={() => undefined}
    />
  );
}

describe("apiKeyAuth heading", () => {
  // "(apiKey)" describes how the value travels. On half of a client
  // credentials pair it reads as though the field were a standalone API key.
  it("omits the type suffix for a grouped scheme", () => {
    renderAuthField(pairedSpec, "clientId");

    expect(screen.queryByText(/\(apiKey\)/)).toBeNull();
    expect(screen.getByText("clientId")).toBeTruthy();
  });

  it("keeps the type suffix for a scheme that stands alone", () => {
    renderAuthField(eitherOrSpec, "clientId");

    expect(screen.getByText(/\(apiKey\)/)).toBeTruthy();
  });
});
