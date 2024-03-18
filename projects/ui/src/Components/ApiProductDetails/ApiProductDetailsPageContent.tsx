import { useMemo } from "react";
import {
  ApiProductDetails,
  ApiVersion,
  ApiVersionSchema,
} from "../../Apis/api-types";
import { ApiProductDetailsPageBody } from "./ApiProductDetailsPageBody";
import ApiProductDetailsPageHeading from "./ApiProductDetailsPageHeading";

export function ApiProductDetailsPageContent({
  apiProduct,
  apiProductVersions,
  selectedApiVersion,
  onSelectedApiVersionChange,
}: {
  apiProduct: ApiProductDetails;
  apiProductVersions: ApiVersion[];
  selectedApiVersion: ApiVersion | null;
  onSelectedApiVersionChange: (newVersionId: string | null) => void;
}) {
  const apiVersionSchema = useMemo<ApiVersionSchema | undefined>(() => {
    const apiSpec = selectedApiVersion?.apiSpec;
    if (typeof apiSpec === "string") {
      return JSON.parse(apiSpec);
    }
    return apiSpec;
  }, [selectedApiVersion]);

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
        apiVersionSchema={apiVersionSchema}
      />

      <ApiProductDetailsPageBody
        apiProduct={apiProduct}
        apiProductVersions={apiProductVersions}
        selectedApiVersion={selectedApiVersion}
        apiVersionSchema={apiVersionSchema}
      />
    </div>
  );
}
