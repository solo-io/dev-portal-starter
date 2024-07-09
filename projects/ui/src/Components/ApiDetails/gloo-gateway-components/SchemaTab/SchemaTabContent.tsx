import { Box } from "@mantine/core";
import {
  ApiProductSummary,
  ApiVersion,
  ApiVersionSchema,
} from "../../../../Apis/api-types";
import { EmptyData } from "../../../Common/EmptyData";
import { ErrorBoundary } from "../../../Common/ErrorBoundary";
import { ApiSchemaDisplay } from "./ApiSchemaDisplay";

const SchemaTabContent = ({
  apiProduct,
  selectedApiVersion,
  apiProductVersions,
  apiVersionSpec,
}: {
  apiProduct: ApiProductSummary;
  selectedApiVersion: ApiVersion;
  apiProductVersions: ApiVersion[];
  apiVersionSpec: ApiVersionSchema | undefined;
}) => {
  if (!apiProductVersions.length) {
    return (
      <Box m="60px">
        <EmptyData
          topicMessageOverride={`The API Product, "${apiProduct.name}", has no API Version data.`}
        />
      </Box>
    );
  }
  if (!selectedApiVersion) {
    // The selected API Version may be loading.
    return null;
  }
  if (!apiVersionSpec) {
    // There is a selected API version, but no schema.
    return (
      <Box m="60px">
        <EmptyData
          topicMessageOverride={`No schema was returned for the API Version: "${selectedApiVersion.name}".`}
        />
      </Box>
    );
  }
  return (
    <div>
      <ErrorBoundary fallback="There was an issue displaying the schema details">
        <ApiSchemaDisplay
          apiVersionSpec={apiVersionSpec}
          apiVersionId={selectedApiVersion.id}
        />
      </ErrorBoundary>
    </div>
  );
};

export default SchemaTabContent;
