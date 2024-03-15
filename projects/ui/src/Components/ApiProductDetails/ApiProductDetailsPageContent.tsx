import { Box } from "@mantine/core";
import { useMemo } from "react";
import {
  ApiProductDetails,
  ApiVersion,
  ApiVersionSchema,
} from "../../Apis/api-types";
import { EmptyData } from "../Common/EmptyData";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import ApiProductDetailsPageHeading from "./ApiProductDetailsPageHeading";
import { ApiSchemaDisplay } from "./SchemaTab/ApiSchemaDisplay";

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

      {!!selectedApiVersion ? (
        <ErrorBoundary fallback="There was an issue displaying the schema details">
          {!apiVersionSchema ? (
            <Box m="60px">
              <EmptyData
                topicMessageOverride={`No schema was returned for the API Version: "${selectedApiVersion.name}".`}
              />
            </Box>
          ) : (
            <ApiSchemaDisplay
              apiVersionSchema={apiVersionSchema}
              apiVersionId={selectedApiVersion.id}
            />
          )}
        </ErrorBoundary>
      ) : (
        !apiProductVersions.length && (
          <Box m="60px">
            <EmptyData
              topicMessageOverride={`The API Product, "${apiProduct.name}", has no API Version data.`}
            />
          </Box>
        )
      )}
    </div>
  );
}
