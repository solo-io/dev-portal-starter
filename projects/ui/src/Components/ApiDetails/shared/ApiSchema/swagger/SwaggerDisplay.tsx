import { useContext, useEffect, useState } from "react";
import SwaggerUIConstructor from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";
import { ApiVersionSchema } from "../../../../../Apis/api-types";
import { AuthContext } from "../../../../../Context/AuthContext";
import { swaggerConfigURL } from "../../../../../user_variables.tmplr";
import { SwaggerDisplayContainer } from "./SwaggerDisplay.style";

const sanitize = (id: string) => id.replaceAll(".", "-");

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
      withCredentials: true,
      deepLinking: true,
      configUrl: swaggerConfigURL !== "" ? swaggerConfigURL : undefined,
    });
    // swaggerInstance.preauthorizeApiKey(
    //   "Authorization",
    //   tokensResponse?.access_token ?? ""
    // );
    /** TODO
     * The first arg here (authDefinitionKey), refers to the key (api_key)
     * in the `apiVersionSpec.components.securitySchemes` object.
     * This looks like it is user defined, but has a specific (apiKey) type
     * in the object... so will need to look at this some more.
     **/
    if (!!tokensResponse?.access_token) {
      // TODO: This might need to be a type of oauth2 flow, a basic auth flow, or something else.
      swaggerInstance.preauthorizeApiKey(
        "api_key",
        tokensResponse.access_token
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
