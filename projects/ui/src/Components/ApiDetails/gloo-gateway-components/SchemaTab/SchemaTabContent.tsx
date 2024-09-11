import { Box, Code } from "@mantine/core";
import { ApiVersion, ApiVersionSchema } from "../../../../Apis/api-types";
import { SimpleEmptyContent } from "../../../Common/EmptyData";
import { ErrorBoundary } from "../../../Common/ErrorBoundary";
import { ApiSchemaDisplay } from "./ApiSchemaDisplay";

const SchemaTabContent = ({
  selectedApiVersion,
  apiProductVersions,
  apiVersionSpec,
}: {
  selectedApiVersion: ApiVersion;
  apiProductVersions: ApiVersion[];
  apiVersionSpec: ApiVersionSchema | undefined;
}) => {
  if (!apiProductVersions.length) {
    return (
      <Box m="60px">
        <SimpleEmptyContent title={`No API versions found.`}>
          Add a version to the <Code>spec.versions</Code> field of this{" "}
          <Code>ApiProduct</Code> for data to appear.
        </SimpleEmptyContent>
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
        <SimpleEmptyContent title={`No schema found.`}>
          The schema was not returned for this <Code>ApiProduct</Code> version.
          <br />
          Verify that your OpenApi spec was generated correctly in the
          corresponding <Code>ApiDoc</Code> resource for this{" "}
          <Code>Service</Code>.
        </SimpleEmptyContent>
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
