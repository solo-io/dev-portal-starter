/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";

/**
 * Puts `apiKey` schemes that one security requirement names together (a client
 * ID and an API key) into one Authorize form. Markup follows Swagger UI's
 * `src/core/components/auth/`.
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
 * Merges each group that `definitions` holds in full into one entry, which
 * Swagger UI renders as one form. OAuth2 schemes keep their own button.
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
      : groups.find(
          (g) =>
            g.includes(name) &&
            g.every((member) => definitions.some((d: any) => d.has(member)))
        );
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
 * Regroups after Swagger UI picks the schemes an operation requires, so its
 * match on each entry's first scheme stays exact.
 */
const wrapShownDefinitions =
  (ori: any, system: any) =>
  (_state: any, ...args: any[]) => {
    // `ori` is already bound to the auth state, so the state this wrapper is
    // handed must not be passed along.
    return regroup(ori(...args), schemeGroups(system));
  };

// The client ID scheme's key (its header name is user-configured). A client ID
// is not secret, so it is shown once authorized.
const clientIdSchemeName = "clientId";

/**
 * Swagger UI's `apiKeyAuth` without the "(apiKey)" suffix in a shared form, and
 * with an input id per scheme (the original reuses `api_key_value`).
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
