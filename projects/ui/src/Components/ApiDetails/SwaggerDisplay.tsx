import { useEffect } from "react";
import SwaggerUIConstructor from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";

export function SwaggerDisplay({
  spec,
  apiId,
}: {
  spec: string;
  apiId: string;
}) {
  useEffect(() => {
    SwaggerUIConstructor({
      spec: spec,
      dom_id: `#display-swagger-${apiId}`,
      withCredentials: true,
      deepLinking: true,
      syntaxHighlight: { activated: false },
    });
  }, [apiId]);

  return <div aria-label="Schema Display" id={`display-swagger-${apiId}`} />;
}
