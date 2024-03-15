import { RedocStandalone } from "redoc";
import { ApiVersionSchema } from "../../../../Apis/api-types";
import { RedocDisplayContainer } from "./RedocDisplay.style";

export function RedocDisplay({
  apiVersionSchema,
}: {
  apiVersionSchema: ApiVersionSchema | undefined;
}) {
  return (
    <RedocDisplayContainer aria-label="Schema Display">
      <RedocStandalone spec={apiVersionSchema} />
    </RedocDisplayContainer>
  );
}
