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
  import.meta.env.VITE_TOKEN_ENDPOINT,
  "https://f983-2600-1700-1e17-8010-1434-ceb1-8a68-cb20.ngrok-free.app/auth/realms/master/protocol/openid-connect/token"
);

/**
 * The oauth client id.
 * In keycloak, this is shown in the client settings
 * of your keycloak instances UI: <your-keycloak-url>/auth
 */
export const clientId = templateString(
  "{{ tmplr.clientId }}",
  import.meta.env.VITE_CLIENT_ID,
  "17daa3f6-9c0f-41c6-a620-62082da22f94"
);

/**
 * The oauth client secret.
 * In keycloak, this is shown in the client settings
 * of your keycloak instances UI: <your-keycloak-url>/auth
 */
export const clientSecret = templateString(
  "{{ tmplr.clientSecret }}",
  import.meta.env.VITE_CLIENT_SECRET,
  "19e4265d-5a68-406c-bb77-8f487da1fb3f"
);
