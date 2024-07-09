import { useEffect, useState } from "react";
import SwaggerUIConstructor from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";
import { ApiVersionSchema } from "../../../../../Apis/api-types";
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
    SwaggerUIConstructor({
      spec: apiVersionSpec,
      dom_id: `#display-swagger-${sanitizedDomId}`,
      withCredentials: true,
      deepLinking: true,
      configUrl: swaggerConfigURL !== "" ? swaggerConfigURL : undefined,
    });
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
