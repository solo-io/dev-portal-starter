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
function templateString(templateString: string, ...defaultValues: string[]) {
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
  "Acme Co."
);
document.title = companyName + " Portal";

/**
 * This is the endpoint to get the oauth token.
 * In keycloak, this is the `token_endpoint` property from:
 * <your-keycloak-url>/auth/realms/<your-realm>/.well-known/openid-configuration
 */
export const tokenEndpoint = templateString(
  "{{ tmplr.tokenEndpoint }}",
  import.meta.env.VITE_TOKEN_ENDPOINT
);

/**
 * This is the endpoint to get the PKCE auth token.
 * In keycloak, this is the `authorization_endpoint` property from:
 * <your-keycloak-url>/auth/realms/<your-realm>/.well-known/openid-configuration
 */
export const authEndpoint = templateString(
  "{{ tmplr.authEndpoint }}",
  import.meta.env.VITE_AUTH_ENDPOINT
);

/**
 * This is the endpoint to end your session.
 * In keycloak, this is the `end_session_endpoint` property from:
 * <your-keycloak-url>/auth/realms/<your-realm>/.well-known/openid-configuration
 */
export const logoutEndpoint = templateString(
  "{{ tmplr.logoutEndpoint }}",
  import.meta.env.VITE_LOGOUT_ENDPOINT
);

/**
 * The oauth client id.
 * In keycloak, this is shown in the client settings
 * of your keycloak instances UI: <your-keycloak-url>/auth
 */
export const clientId = templateString(
  "{{ tmplr.clientId }}",
  import.meta.env.VITE_CLIENT_ID
);
