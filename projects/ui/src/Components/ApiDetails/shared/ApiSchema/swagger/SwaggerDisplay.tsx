import { createElement, useContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import SwaggerUIConstructor from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";
import { ApiVersionSchema } from "../../../../../Apis/api-types";
import { AuthContext } from "../../../../../Context/AuthContext";
import {
  swaggerConfigURL,
  swaggerPrefillApiKey,
  swaggerPrefillBasic,
  swaggerPrefillOauth,
} from "../../../../../user_variables.tmplr";
import { SwaggerDisplayContainer } from "./SwaggerDisplay.style";

const sanitize = (id: string) => id.replaceAll(".", "-");

/**
 * Swagger UI mounts itself with `const { createRoot } = reactDom`, but React 19
 * moved `createRoot` from `react-dom` to `react-dom/client`. That destructure
 * yields `undefined`, so Swagger UI throws "o is not a function" and renders
 * nothing (still the case in swagger-ui 5.32.11, its latest release).
 *
 * `rootInjects` is Swagger UI's documented plugin hook for replacing system
 * methods — they are merged over the built-ins — so we supply a `render` that
 * mounts through `react-dom/client` instead. This keeps `swagger-ui` as a normal
 * source dependency, so its transitive packages stay patchable via `resolutions`
 * and visible to CVE scanners (the prebuilt `swagger-ui-dist` bundle would be
 * neither).
 */
const reactDomClientRenderPlugin = (system: {
  getComponent: (name: string, root: "root") => Parameters<typeof createElement>[0];
}) => ({
  rootInjects: {
    render: (domNode: Element | DocumentFragment) => {
      createRoot(domNode).render(
        createElement(system.getComponent("App", "root"))
      );
    },
  },
});

export function SwaggerDisplay({
  apiVersionSpec,
  apiVersionId,
}: {
  apiVersionSpec: ApiVersionSchema | undefined;
  apiVersionId: string;
}) {
  const { tokensResponse } = useContext(AuthContext);

  // The sanitized dom_id, where all periods are replaced with dashes. This fixes issues where Swagger tries
  // doing a `querySelector` which fails, due to it treating the period as a class selector, and not part of the ID itself.
  const [sanitizedDomId, setSanitizedDomId] = useState<string>(
    sanitize(apiVersionId)
  );
  useEffect(() => {
    const newSanitizedId = sanitize(apiVersionId);
    if (sanitizedDomId !== newSanitizedId) {
      setSanitizedDomId(newSanitizedId);
    }
  }, [apiVersionId, sanitizedDomId]);

  useEffect(() => {
    const swaggerInstance = SwaggerUIConstructor({
      spec: apiVersionSpec,
      dom_id: `#display-swagger-${sanitizedDomId}`,
      plugins: [reactDomClientRenderPlugin],
      withCredentials: true,
      deepLinking: true,
      configUrl: swaggerConfigURL !== "" ? swaggerConfigURL : undefined,
    });

    // Here we pass through user supplied configuration for each of these Swagger UI instance methods:
    // https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md#instance-methods

    // API KEY AUTH
    if (swaggerPrefillApiKey !== undefined) {
      let apiKeyValue = swaggerPrefillApiKey.apiKeyValue;
      if (!!tokensResponse?.access_token) {
        // Try to find & replace the "{{USER_TOKEN}}" string with this user's access token.
        // This is documented in the README.md.
        apiKeyValue = apiKeyValue.replace(
          "{{USER_TOKEN}}",
          tokensResponse.access_token
        );
      }
      swaggerInstance.preauthorizeApiKey(
        swaggerPrefillApiKey.authDefinitionKey,
        apiKeyValue
      );
    }

    // OAUTH
    if (swaggerPrefillOauth !== undefined) {
      swaggerInstance.initOAuth(swaggerPrefillOauth);
    }

    // BASIC AUTH
    if (swaggerPrefillBasic !== undefined) {
      swaggerInstance.preauthorizeBasic(
        swaggerPrefillBasic.authDefinitionKey,
        swaggerPrefillBasic.username,
        swaggerPrefillBasic.password
      );
    }
  }, [sanitizedDomId, apiVersionSpec]);

  return (
    <SwaggerDisplayContainer>
      <div
        aria-label="Schema Display"
        id={`display-swagger-${sanitizedDomId}`}
      />
    </SwaggerDisplayContainer>
  );
}
