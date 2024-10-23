/**
 *
 * These variables are assigned with CLI input when initializing
 * the project with tmplr: https://github.com/loreanvictor/tmplr
 *
 * They can also be updated manually at any time.
 *
 */

/**
 * This checks if a `templateString` has been transformed by tmplr.
 * If it has not been transformed, the next truthy value is returned.
 * Otherwise, the transformed value is returned.
 */
function templateString(
  templateString: string,
  ...defaultValues: (string | undefined)[]
) {
  if (/{{.*}}$/.test(templateString)) {
    let defaultValue = "";
    for (let i = 0; i < defaultValues.length; i++) {
      const curValue = defaultValues[i];
      if (!!curValue) {
        defaultValue = curValue;
        break;
      }
    }
    return defaultValue;
  }
  return templateString;
}

//
// Project Settings
//
export const companyName = templateString(
  "{{ tmplr.company_name }}",
  insertedEnvironmentVariables?.VITE_COMPANY_NAME,
  import.meta.env.VITE_COMPANY_NAME,
  "Example Company"
);
document.title = companyName + " Portal";

/**
 * This is the endpoint to get the oauth token.
 * In keycloak, this is the `token_endpoint` property from:
 * <your-keycloak-url>/realms/<your-realm>/.well-known/openid-configuration
 */
export const tokenEndpoint = templateString(
  "{{ tmplr.tokenEndpoint }}",
  insertedEnvironmentVariables?.VITE_TOKEN_ENDPOINT,
  import.meta.env.VITE_TOKEN_ENDPOINT
);

/**
 * This is the endpoint to get the PKCE auth token.
 * In keycloak, this is the `authorization_endpoint` property from:
 * <your-keycloak-url>/realms/<your-realm>/.well-known/openid-configuration
 */
export const authEndpoint = templateString(
  "{{ tmplr.authEndpoint }}",
  insertedEnvironmentVariables?.VITE_AUTH_ENDPOINT,
  import.meta.env.VITE_AUTH_ENDPOINT
);

/**
 * This is the endpoint to end your session.
 * In keycloak, this is the `end_session_endpoint` property from:
 * <your-keycloak-url>/realms/<your-realm>/.well-known/openid-configuration
 */
export const logoutEndpoint = templateString(
  "{{ tmplr.logoutEndpoint }}",
  insertedEnvironmentVariables?.VITE_LOGOUT_ENDPOINT,
  import.meta.env.VITE_LOGOUT_ENDPOINT
);

/**
 * The oauth client id.
 * In keycloak, this is shown in the client settings
 * of your keycloak instances UI: <your-keycloak-url>/auth
 */
export const clientId = templateString(
  "{{ tmplr.clientId }}",
  insertedEnvironmentVariables?.VITE_CLIENT_ID,
  import.meta.env.VITE_CLIENT_ID
);

/**
 * This is optional and only needed if this app is deployed in the mesh
 * and the ExtAuthPolicy uses an oidcAuthorizationCode config.
 */
export const appliedOidcAuthCodeConfig = templateString(
  "{{ tmplr.appliedOidcAuthCodeConfig }}",
  insertedEnvironmentVariables?.VITE_APPLIED_OIDC_AUTH_CODE_CONFIG,
  import.meta.env.VITE_APPLIED_OIDC_AUTH_CODE_CONFIG
);

/**
 * This is optional and only needed if this app is deployed in the mesh
 * and the ExtAuthPolicy uses an oidcAuthorizationCode config.
 * Defaults to ${PORTAL_SERVER_URL}/login
 */
export const oidcAuthCodeConfigCallbackPath = templateString(
  "{{ tmplr.oidcAuthCodeConfigCallbackPath }}",
  insertedEnvironmentVariables?.VITE_OIDC_AUTH_CODE_CONFIG_CALLBACK_PATH,
  import.meta.env.VITE_OIDC_AUTH_CODE_CONFIG_CALLBACK_PATH,
  (import.meta.env.VITE_PORTAL_SERVER_URL ?? "") + "/login"
);

/**
 * This is optional and only needed if this app is deployed in the mesh
 * and the ExtAuthPolicy uses an oidcAuthorizationCode config.
 * Defaults to ${PORTAL_SERVER_URL}/logout.
 */
export const oidcAuthCodeConfigLogoutPath = templateString(
  "{{ tmplr.oidcAuthCodeConfigLogoutPath }}",
  insertedEnvironmentVariables?.VITE_OIDC_AUTH_CODE_CONFIG_LOGOUT_PATH,
  import.meta.env.VITE_OIDC_AUTH_CODE_CONFIG_LOGOUT_PATH,
  (import.meta.env.VITE_PORTAL_SERVER_URL ?? "") + "/logout"
);

/**
 * This is optional.
 */
export const swaggerConfigURL = templateString(
  "{{ tmplr.swaggerConfigURL }}",
  insertedEnvironmentVariables?.VITE_SWAGGER_CONFIG_URL,
  import.meta.env.VITE_SWAGGER_CONFIG_URL,
  ""
);

/**
 * This is optional, used with Auth0.
 */
export const audience = templateString(
  "{{ tmplr.audience }}",
  insertedEnvironmentVariables?.VITE_AUDIENCE,
  import.meta.env.VITE_AUDIENCE,
  ""
);

/**
 * This is optional. Used on the home ("/") page.
 */
export const homeImageURL = templateString(
  "{{ tmplr.homeImageURL }}",
  insertedEnvironmentVariables?.VITE_HOME_IMAGE_URL,
  import.meta.env.VITE_HOME_IMAGE_URL,
  ""
);

/**
 * This is optional. Used on the API's ("/apis") page.
 */
export const bannerImageURL = templateString(
  "{{ tmplr.bannerImageURL }}",
  insertedEnvironmentVariables?.VITE_BANNER_IMAGE_URL,
  import.meta.env.VITE_BANNER_IMAGE_URL,
  ""
);

/**
 * This is optional. Used on the upper left corder of the website.
 */
export const logoImageURL = templateString(
  "{{ tmplr.logoImageURL }}",
  insertedEnvironmentVariables?.VITE_LOGO_IMAGE_URL,
  import.meta.env.VITE_LOGO_IMAGE_URL,
  ""
);

export type CustomPage = {
  title: string;
  path: string;
};
/**
 * This is an optional, JSON serialized array of objects.
 * Each object has a "title" and "path" that corresponds to a ".html" or ".md" file in the `projects/ui/src/public` folder.
 * The name is the text that is displayed in the navbar header link.
 * For example:
 * '[{"title":"Custom Page","path":"/custom-page.md"}, {"title":"Another Page","path":"/some-path/another-page.html"}]'
 */
export const customPages = JSON.parse(
  templateString(
    "{{ tmplr.customPages }}",
    insertedEnvironmentVariables?.VITE_CUSTOM_PAGES,
    import.meta.env.VITE_CUSTOM_PAGES,
    "[]"
  )
) as Array<CustomPage>;
// TODO: Check the paths and if any overlap with the dev-portal-starter.
// console.log("Loaded custom pages", customPages);

/**
 * This is optional. Check the README for usage.
 */
export const swaggerPrefillApiKey = (() => {
  const parsed = JSON.parse(
    templateString(
      "{{ tmplr.swaggerPrefillApiKey }}",
      insertedEnvironmentVariables?.VITE_SWAGGER_PREFILL_API_KEY,
      import.meta.env.VITE_SWAGGER_PREFILL_API_KEY,
      "[]"
    )
  ) as [string, string] | [];
  return parsed.length === 2
    ? {
        authDefinitionKey: parsed[0],
        apiKeyValue: parsed[1],
      }
    : undefined;
})();

/**
 * This is optional. Check the README for usage.
 */
export const swaggerPrefillOauth = (() => {
  const parsed = JSON.parse(
    templateString(
      "{{ tmplr.swaggerPrefillOauth }}",
      insertedEnvironmentVariables?.VITE_SWAGGER_PREFILL_OAUTH,
      import.meta.env.VITE_SWAGGER_PREFILL_OAUTH,
      "{}"
    )
  );
  return Object.keys(parsed).length > 0 ? parsed : undefined;
})();

/**
 * This is optional. Check the README for usage.
 */
export const swaggerPrefillBasic = (() => {
  const parsed = JSON.parse(
    templateString(
      "{{ tmplr.swaggerPrefillBasic }}",
      insertedEnvironmentVariables?.VITE_SWAGGER_PREFILL_BASIC,
      import.meta.env.VITE_SWAGGER_PREFILL_BASIC,
      "[]"
    )
  ) as [string, string, string] | [];
  return parsed.length === 3
    ? {
        authDefinitionKey: parsed[0],
        username: parsed[1],
        password: parsed[2],
      }
    : undefined;
})();

/**
 * This is optional.
 */
export enum AppAuthMethod {
  ALL,
  OAUTH,
  API_KEY,
}
export const defaultAppAuthMethod = templateString(
  "{{ tmplr.defaultAppAuthMethod }}",
  insertedEnvironmentVariables?.VITE_DEFAULT_APP_AUTH_METHOD,
  import.meta.env.VITE_DEFAULT_APP_AUTH_METHOD,
  "ALL"
).toUpperCase() as keyof typeof AppAuthMethod;
if (AppAuthMethod[defaultAppAuthMethod] === undefined) {
  // eslint-disable-next-line no-console
  console.error(
    'The value for `VITE_DEFAULT_APP_AUTH_METHOD` must be: "OAUTH", "ALL", or "API_KEY".'
  );
}
