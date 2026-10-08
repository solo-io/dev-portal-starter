/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";

/**
 * Swagger UI gives every security scheme its own form and its own Authorize
 * button, and labels each one "(apiKey)". A credential made of two headers — an
 * API key with a client ID, which OpenAPI can only express as two `apiKey`
 * schemes named together in one security requirement — therefore shows up as
 * two unrelated API keys to be authorized one at a time.
 *
 * This plugin puts schemes that a security requirement names together into one
 * form, so they share a single Authorize button, and drops the "(apiKey)"
 * suffix from the schemes in a shared form, since it describes how the value
 * travels rather than what the credential is. A scheme shown on its own keeps
 * Swagger UI's own rendering.
 *
 * Swagger UI's own components are at `swagger-ui/dist/swagger-ui.js.map`
 * (`src/core/components/auth/`), which is where the markup below comes from.
 */

/** The scheme names each requirement in `security` lists together, pairs and up. */
function groupsIn(security: any): string[][] {
  const groups: string[][] = [];
  if (!security || typeof security.forEach !== "function") {
    return groups;
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
  return groups;
}

/** The groups named at the document root or on any operation. */
function collectSchemeGroups(specJson: any): string[][] {
  if (!specJson || typeof specJson.get !== "function") {
    return [];
  }
  const groups = groupsIn(specJson.get("security"));
  const paths = specJson.get("paths");
  if (paths && typeof paths.forEach === "function") {
    paths.forEach((pathItem: any) => {
      if (!pathItem || typeof pathItem.forEach !== "function") {
        return;
      }
      pathItem.forEach((operation: any) => {
        if (operation && typeof operation.get === "function") {
          groups.push(...groupsIn(operation.get("security")));
        }
      });
    });
  }
  return groups;
}

// Swagger UI holds the parsed spec as one immutable value per document, so it
// keys a cache of the groups cleanly.
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

/**
 * Merges the entries of each group that `definitions` holds in full into one
 * entry. Swagger UI hands each entry to its own form, so this is all it takes
 * for the group's schemes to share one. A scheme whose partners are absent
 * stays in its own entry. OAuth2 schemes are left alone: Swagger UI renders
 * those with their own button.
 */
function regroup(definitions: any, groups: string[][]): any {
  if (
    !groups.length ||
    !definitions ||
    typeof definitions.clear !== "function"
  ) {
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
      : groups.find((g) => g.includes(name));
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
}

/**
 * Regroups the entries the Authorize dialog is showing. Both the global
 * Authorize button and an operation's lock icon store the entries to show
 * through this selector: every scheme for the former, and for the latter the
 * schemes the operation requires, which Swagger UI selects by matching each
 * entry's first scheme against the requirement. Regrouping here, after that
 * selection, keeps the match exact and leaves a scheme that an operation
 * requires without its partner on its own.
 */
const wrapShownDefinitions =
  (ori: any, system: any) =>
  (_state: any, ...args: any[]) => {
    // `ori` is already bound to the auth state, so the state this wrapper is
    // handed must not be passed along.
    return regroup(ori(...args), schemeGroups(system));
  };

/**
 * The portal names the scheme that carries the client ID "clientId"; the
 * header it travels in is whatever the user configured, so only the scheme
 * name identifies it. A client ID is not a secret, so it is shown once
 * authorized rather than masked.
 */
const clientIdSchemeName = "clientId";

/**
 * Swagger UI's `apiKeyAuth`, with the type suffix dropped for a scheme in a
 * shared form, the authorized value shown for a client ID in one, and an input
 * id per scheme — the original hardcodes `api_key_value`, so with two fields
 * in one form both labels would point at the first input.
 */
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
  // The dialog entry this field belongs to; more than one scheme in it means
  // the field shares a form.
  const shown = authSelectors.shownDefinitions?.();
  const entry =
    shown && typeof shown.find === "function"
      ? shown.find((e: any) => e.has(name))
      : undefined;
  const shared = !!entry && entry.size > 1;
  const inputId = `api_key_value_${name}`;

  return (
    <div>
      <h4>
        <code>{name || schema.get("name")}</code>
        {!shared && <>&nbsp;(apiKey)</>}
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
          <code>
            {" "}
            {shared && name === clientIdSchemeName ? value : "******"}{" "}
          </code>
        ) : (
          <Col>
            <Input
              id={inputId}
              type="text"
              autoFocus={!shared || entry.keySeq().first() === name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({ name, schema, value: e.target.value })
              }
            />
          </Col>
        )}
      </Row>
      {
        errors
          .valueSeq()
          .map((error: any, key: number) => (
            <AuthError error={error} key={key} />
          ))
          .toArray() as ReactNode[]
      }
    </div>
  );
};

export const pairedApiKeyAuthPlugin = () => ({
  statePlugins: {
    auth: {
      wrapSelectors: {
        shownDefinitions: wrapShownDefinitions,
      },
    },
  },
  components: {
    apiKeyAuth: ApiKeyAuth,
  },
});
