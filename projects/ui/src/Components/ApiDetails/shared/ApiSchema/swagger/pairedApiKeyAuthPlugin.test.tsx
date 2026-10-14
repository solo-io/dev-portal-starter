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
        security: [{ clientId: [], apiKey: [] }],
      },
    },
  },
  components: {
    securitySchemes: {
      clientId: { type: "apiKey", name: "x-ibm-client-id", in: "header" },
      apiKey: { type: "apiKey", name: "x-ibm-client-secret", in: "header" },
    },
  },
});

/** The same two schemes as alternatives (an OR). */
const eitherOrSpec = fromJS({
  openapi: "3.0.0",
  paths: {
    "/pets": {
      get: {
        security: [{ clientId: [] }, { apiKey: [] }],
      },
    },
  },
  components: {
    securitySchemes: {
      clientId: { type: "apiKey", name: "x-ibm-client-id", in: "header" },
      apiKey: { type: "apiKey", name: "x-ibm-client-secret", in: "header" },
    },
  },
});

function systemFor(spec: unknown) {
  return { specSelectors: { specJson: () => spec } };
}

/**
 * The entries Swagger UI stores for the Authorize dialog: one scheme each, in
 * spec order, limited to `names` when an operation's lock icon opened it.
 */
function stockDefinitions(spec: any, names?: string[]) {
  const schemes = spec.getIn(["components", "securitySchemes"]);
  return schemes
    .entrySeq()
    .filter(([name]: [string, unknown]) => !names || names.includes(name))
    .map(([name, schema]: [string, unknown]) => Map({ [name]: schema }))
    .toList();
}

function shownDefinitions(spec: any, names?: string[]) {
  const system = systemFor(spec);
  const wrap =
    pairedApiKeyAuthPlugin().statePlugins.auth.wrapSelectors.shownDefinitions;
  // Swagger UI hands the wrapper the auth substate ahead of the selector's own
  // arguments.
  return wrap(() => stockDefinitions(spec, names), system)(Map());
}

afterEach(() => {
  cleanup();
});

describe("shownDefinitions grouping", () => {
  it("merges schemes named together into one entry, so they share a button", () => {
    const result = shownDefinitions(pairedSpec);

    expect(result.size).toBe(1);
    expect(result.first().keySeq().toArray()).toEqual(["clientId", "apiKey"]);
  });

  it("leaves alternative schemes in their own entries", () => {
    const result = shownDefinitions(eitherOrSpec);

    expect(result.size).toBe(2);
  });

  it("leaves a scheme alone when the dialog shows it without its partner", () => {
    const result = shownDefinitions(pairedSpec, ["clientId"]);

    expect(result.size).toBe(1);
    expect(result.first().keySeq().toArray()).toEqual(["clientId"]);
  });

  it("pairs a scheme with the partner shown when it appears in several groups", () => {
    const spec = fromJS({
      openapi: "3.0.0",
      security: [{ clientId: [], apiKey: [] }],
      paths: { "/pets": { get: { security: [{ clientId: [], otherKey: [] }] } } },
      components: {
        securitySchemes: {
          clientId: { type: "apiKey", name: "x-client-id", in: "header" },
          apiKey: { type: "apiKey", name: "x-api-key", in: "header" },
          otherKey: { type: "apiKey", name: "x-other-key", in: "header" },
        },
      },
    });

    const result = shownDefinitions(spec, ["clientId", "otherKey"]);

    expect(result.size).toBe(1);
    expect(result.first().keySeq().toArray()).toEqual(["clientId", "otherKey"]);
  });

  it("pairs API keys even when one is also grouped with OAuth2", () => {
    const spec = fromJS({
      openapi: "3.0.0",
      security: [{ oauth: [], apiKey: [] }],
      paths: { "/pets": { get: { security: [{ clientId: [], apiKey: [] }] } } },
      components: {
        securitySchemes: {
          oauth: { type: "oauth2", flows: {} },
          apiKey: { type: "apiKey", name: "x-api-key", in: "header" },
          clientId: { type: "apiKey", name: "x-client-id", in: "header" },
        },
      },
    });

    const result = shownDefinitions(spec);

    expect(
      result.map((e: any) => e.keySeq().toArray().join("+")).toArray()
    ).toEqual(["oauth", "apiKey+clientId"]);
  });

  it("keeps every OAuth2 flow, which Swagger UI lists under one name", () => {
    const wrap =
      pairedApiKeyAuthPlugin().statePlugins.auth.wrapSelectors.shownDefinitions;
    const flow = (name: string) =>
      Map({ oauth: fromJS({ type: "oauth2", flow: name }) });
    const definitions = stockDefinitions(pairedSpec).push(
      flow("authorizationCode"),
      flow("clientCredentials")
    );

    const result = wrap(() => definitions, systemFor(pairedSpec))(Map());

    expect(
      result.map((e: any) => e.keySeq().toArray().join("+")).toArray()
    ).toEqual(["clientId+apiKey", "oauth", "oauth"]);
  });

  it("passes a closed dialog through", () => {
    const wrap =
      pairedApiKeyAuthPlugin().statePlugins.auth.wrapSelectors.shownDefinitions;

    expect(wrap(() => false, systemFor(pairedSpec))(Map())).toBe(false);
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

/** Renders the field for `name` in a dialog showing the schemes in `shown`. */
function renderAuthField(
  spec: any,
  name: string,
  shown: string[],
  authorizedValue?: string
) {
  const ApiKeyAuth = pairedApiKeyAuthPlugin().components.apiKeyAuth;
  render(
    <ApiKeyAuth
      schema={spec.getIn(["components", "securitySchemes", name])}
      name={name}
      getComponent={getComponent}
      errSelectors={{ allErrors: () => List() }}
      authSelectors={{
        selectAuthPath: () => List(),
        shownDefinitions: () => shownDefinitions(spec, shown),
      }}
      authorized={
        authorizedValue === undefined
          ? Map()
          : fromJS({ [name]: { value: authorizedValue } })
      }
      onChange={() => undefined}
    />
  );
}

describe("apiKeyAuth", () => {
  it("omits the type suffix for a scheme in a shared form", () => {
    renderAuthField(pairedSpec, "clientId", ["clientId", "apiKey"]);

    expect(screen.queryByText(/\(apiKey\)/)).toBeNull();
    expect(screen.getByText("clientId")).toBeTruthy();
  });

  it("shows the client ID of a shared form once authorized", () => {
    renderAuthField(
      pairedSpec,
      "clientId",
      ["clientId", "apiKey"],
      "my-client"
    );

    expect(screen.getByText("my-client")).toBeTruthy();
  });

  it("masks the API key of a shared form once authorized", () => {
    renderAuthField(pairedSpec, "apiKey", ["clientId", "apiKey"], "shh");

    expect(screen.queryByText("shh")).toBeNull();
    expect(screen.getByText("******")).toBeTruthy();
  });

  it("keeps Swagger UI's own rendering for a scheme shown on its own", () => {
    renderAuthField(pairedSpec, "clientId", ["clientId"], "my-client");

    expect(screen.getByText(/\(apiKey\)/)).toBeTruthy();
    expect(screen.queryByText("my-client")).toBeNull();
    expect(screen.getByText("******")).toBeTruthy();
  });
});
