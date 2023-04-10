import { useEffect } from "react";
import SwaggerUIConstructor from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";
import { APISchema } from "../../Apis/api-types";

export function SwaggerDisplay({
  spec,
  apiId,
}: {
  spec: APISchema | undefined;
  apiId: string;
}) {
  useEffect(() => {
    SwaggerUIConstructor({
      spec: spec,
      dom_id: `#display-swagger-${apiId}`,
      withCredentials: true,
      deepLinking: true,
      syntaxHighlight: { activate: false },
    });
  }, [apiId]);

  return <div aria-label="Schema Display" id={`display-swagger-${apiId}`} />;
}
