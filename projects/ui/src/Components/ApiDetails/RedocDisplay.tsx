import { RedocStandalone } from "redoc";
import { APISchema } from "../../Apis/api-types";
import { RedocDisplayContainer } from "./RedocDisplay.style";

export function RedocDisplay({ spec }: { spec: APISchema | undefined }) {
  return (
    <RedocDisplayContainer aria-label="Schema Display">
      <RedocStandalone spec={spec} />
    </RedocDisplayContainer>
  );
}
