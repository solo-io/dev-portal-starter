import { RedocStandalone } from "redoc";
import { APISchema } from "../../Apis/api-types";

export function RedocDisplay({ spec }: { spec: APISchema }) {
  return (
    <div className="redocDisplayContainer" aria-label="Schema Display">
      <RedocStandalone spec={spec} />
    </div>
  );
}
