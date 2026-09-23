/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";

/**
 * Swagger UI gives every security scheme its own form and its own Authorize
 * button, and labels each one "(apiKey)". A credential made of two headers — a
 * client ID and a client secret, which OpenAPI can only express as two `apiKey`
 * schemes named together in one security requirement — therefore shows up as
 * two unrelated API keys to be authorized one at a time.
 *
 * This plugin puts schemes that a security requirement names together back in
 * one form, so they share a single Authorize button, and drops the "(apiKey)"
 * suffix for them, since it describes how the value travels rather than what
 * the credential is. A scheme that stands alone keeps Swagger UI's own
 * rendering.
 *
 * Swagger UI's own components are at `swagger-ui/dist/swagger-ui.js.map`
 * (`src/core/components/auth/`), which is where the markup below comes from.
 */

/** The scheme names each security requirement lists together, pairs and up. */
function collectSchemeGroups(specJson: any): string[][] {
  const groups: string[][] = [];
  const addFrom = (security: any) => {
    if (!security || typeof security.forEach !== "function") {
      return;
    }
    security.forEach((requirement: any) => {
      if (!requirement || typeof requirement.keySeq !== "function") {
        return;
      }
      const names: string[] = requirement.keySeq().toArray();
      if (names.length > 1) {
        groups.push(names);
      }
    });
  };
  if (!specJson || typeof specJson.get !== "function") {
    return groups;
  }
  // A requirement can sit at the document root or on any operation. The portal
  // projects it per operation.
  addFrom(specJson.get("security"));
  const paths = specJson.get("paths");
  if (paths && typeof paths.forEach === "function") {
    paths.forEach((pathItem: any) => {
      if (!pathItem || typeof pathItem.forEach !== "function") {
        return;
      }
      pathItem.forEach((operation: any) => {
        if (operation && typeof operation.get === "function") {
          addFrom(operation.get("security"));
        }
      });
    });
  }
  return groups;
}

// Walking the spec on every render would be wasteful, and Swagger UI holds the
// parsed spec as one immutable value per document, so it keys a cache cleanly.
const groupCache = new WeakMap<object, string[][]>();

function schemeGroups(system: any): string[][] {
  const specJson = system?.specSelectors?.specJson?.();
  if (!specJson || typeof specJson !== "object") {
    return [];
  }
  let groups = groupCache.get(specJson);
  if (groups === undefined) {
    groups = collectSchemeGroups(specJson);
    groupCache.set(specJson, groups);
  }
  return groups;
}

function groupForScheme(system: any, name: string): string[] | undefined {
  return schemeGroups(system).find((group) => group.includes(name));
}

/**
 * Regroups the authorization dialog's entries. Swagger UI hands each scheme to
 * its own `<Auths>` — one form, one Authorize button — so merging the entries
 * of one requirement into a single map is all it takes to have them share a
 * form. OAuth2 schemes are left alone: `<Auths>` renders those outside the
 * form, where the shared button would not reach them.
 */
const wrapDefinitionsToAuthorize =
  (ori: any, system: any) =>
  (_state: any, ...args: any[]) => {
    // `ori` is already bound to the auth state, so the state this wrapper is
    // handed must not be passed along.
    const definitions = ori(...args);
    const groups = schemeGroups(system);
    if (!groups.length || !definitions || typeof definitions.clear !== "function") {
      return definitions;
    }

    const isOauth2 = (entry: any, name: string) =>
      entry.get(name)?.get?.("type") === "oauth2";

    const merged = new Set<string>();
    let regrouped = definitions.clear();
    definitions.forEach((entry: any) => {
      const name: string = entry.keySeq().first();
      if (merged.has(name)) {
        return;
      }
      merged.add(name);
      const group = isOauth2(entry, name)
        ? undefined
        : groupForScheme(system, name);
      if (!group) {
        regrouped = regrouped.push(entry);
        return;
      }
      let combined = entry;
      group.forEach((member: string) => {
        if (merged.has(member)) {
          return;
        }
        const other = definitions.find((d: any) => d.has(member));
        if (!other || isOauth2(other, member)) {
          return;
        }
        combined = combined.merge(other);
        merged.add(member);
      });
      regrouped = regrouped.push(combined);
    });
    return regrouped;
  };

/**
 * Swagger UI's `apiKeyAuth`, with the type suffix dropped for a grouped scheme
 * and an input id per scheme — the original hardcodes `api_key_value`, so with
 * two fields in one form both labels would point at the first input.
 */
const makeApiKeyAuth = (system: any) => {
  const ApiKeyAuth = ({
    schema,
    getComponent,
    errSelectors,
    name,
    authSelectors,
    authorized,
    onChange,
  }: any) => {
    const Input = getComponent("Input");
    const Row = getComponent("Row");
    const Col = getComponent("Col");
    const AuthError = getComponent("authError");
    const Markdown = getComponent("Markdown", true);
    const JumpToPath = getComponent("JumpToPath", true);

    const value = authorized && authorized.getIn([name, "value"]);
    const errors = errSelectors
      .allErrors()
      .filter((err: any) => err.get("authId") === name);
    const group = groupForScheme(system, name);
    const inputId = `api_key_value_${name}`;

    return (
      <div>
        <h4>
          <code>{name || schema.get("name")}</code>
          {!group && <>&nbsp;(apiKey)</>}
          <JumpToPath path={authSelectors.selectAuthPath(name)} />
        </h4>
        {!!value && <h6>Authorized</h6>}
        <Row>
          <Markdown source={schema.get("description")} />
        </Row>
        <Row>
          <p>
            Name: <code>{schema.get("name")}</code>
          </p>
        </Row>
        <Row>
          <p>
            In: <code>{schema.get("in")}</code>
          </p>
        </Row>
        <Row>
          <label htmlFor={inputId}>Value:</label>
          {value ? (
            <code> ****** </code>
          ) : (
            <Col>
              <Input
                id={inputId}
                type="text"
                autoFocus={!group || group[0] === name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChange({ name, schema, value: e.target.value })
                }
              />
            </Col>
          )}
        </Row>
        {errors
          .valueSeq()
          .map((error: any, key: number) => (
            <AuthError error={error} key={key} />
          ))
          .toArray() as ReactNode[]}
      </div>
    );
  };
  return ApiKeyAuth;
};

export const pairedApiKeyAuthPlugin = (system: any) => ({
  statePlugins: {
    auth: {
      wrapSelectors: {
        definitionsToAuthorize: wrapDefinitionsToAuthorize,
      },
    },
  },
  components: {
    apiKeyAuth: makeApiKeyAuth(system),
  },
});
