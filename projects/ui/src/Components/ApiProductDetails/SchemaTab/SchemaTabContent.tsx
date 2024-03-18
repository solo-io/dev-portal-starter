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
  return (
    <div>
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
};

export default SchemaTabContent;
