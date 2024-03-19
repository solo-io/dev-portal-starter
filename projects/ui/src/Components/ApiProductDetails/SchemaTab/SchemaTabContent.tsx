import { Box } from "@mantine/core";
import {
  ApiProductDetails,
  ApiVersion,
  ApiVersionSchema,
} from "../../../Apis/api-types";
import { EmptyData } from "../../Common/EmptyData";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { ApiSchemaDisplay } from "./ApiSchemaDisplay";

const SchemaTabContent = ({
  apiProduct,
  selectedApiVersion,
  apiProductVersions,
  apiVersionSchema,
}: {
  apiProduct: ApiProductDetails;
  selectedApiVersion: ApiVersion;
  apiProductVersions: ApiVersion[];
  apiVersionSchema: ApiVersionSchema | undefined;
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
  if (!apiVersionSchema) {
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
          apiVersionSchema={apiVersionSchema}
          apiVersionId={selectedApiVersion.id}
        />
      </ErrorBoundary>
    </div>
  );
};

export default SchemaTabContent;
