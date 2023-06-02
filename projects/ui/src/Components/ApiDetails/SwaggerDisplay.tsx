import { useEffect, useState } from "react";
import SwaggerUIConstructor from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";
import { APISchema } from "../../Apis/api-types";

const sanitize = (id: string) => id.replaceAll(".", "-");

export function SwaggerDisplay({
  spec,
  apiId,
}: {
  spec: APISchema | undefined;
  apiId: string;
}) {
  // The sanitized dom_id, where all periods are replaced with dashes. This fixes issues where Swagger tries
  // doing a `querySelector` which fails, due to it treating the period as a class selector, and not part of the ID itself.
  const [sanitizedDomId, setSanitizedDomId] = useState<string>(sanitize(apiId));
  useEffect(() => {
    const newSanitizedId = sanitize(apiId);
    if (sanitizedDomId !== newSanitizedId) {
      setSanitizedDomId(newSanitizedId);
    }
  }, [apiId, sanitizedDomId]);

  useEffect(() => {
    SwaggerUIConstructor({
      spec: spec,
      dom_id: `#display-swagger-${sanitizedDomId}`,
      withCredentials: true,
      deepLinking: true,
      syntaxHighlight: { activate: false },
    });
  }, [sanitizedDomId, spec]);

  return (
    <div aria-label="Schema Display" id={`display-swagger-${sanitizedDomId}`} />
  );
}
