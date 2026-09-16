import { useMemo } from "react";
import {
  ApiProductSummary,
  ApiVersion,
  normalizeApiVersionSchema,
} from "../../../Apis/api-types";
import { ApiProductDetailsPageBody } from "./ApiProductDetailsPageBody";
import ApiProductDetailsPageHeading from "./ApiProductDetailsPageHeading";

export function ApiProductDetailsPageContent({
  apiProduct,
  apiProductVersions,
  selectedApiVersion,
  onSelectedApiVersionChange,
}: {
  apiProduct: ApiProductSummary;
  apiProductVersions: ApiVersion[];
  selectedApiVersion: ApiVersion | null;
  onSelectedApiVersionChange: (newVersionId: string | null) => void;
}) {
  const apiVersionSpec = useMemo(
    () => normalizeApiVersionSchema(selectedApiVersion?.apiSpec),
    [selectedApiVersion]
  );

  //
  // Render
  //
  return (
    <div>
      <ApiProductDetailsPageHeading
        apiProduct={apiProduct}
        apiProductVersions={apiProductVersions}
        selectedApiVersion={selectedApiVersion}
        onSelectedApiVersionChange={onSelectedApiVersionChange}
        apiVersionSpec={apiVersionSpec}
      />

      <ApiProductDetailsPageBody
        apiProduct={apiProduct}
        apiProductVersions={apiProductVersions}
        selectedApiVersion={selectedApiVersion}
        apiVersionSpec={apiVersionSpec}
      />
    </div>
  );
}
