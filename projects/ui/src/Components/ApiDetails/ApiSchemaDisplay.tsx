import { Button } from "@mantine/core";
import { useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { useParams } from "react-router-dom";
import YAML from "yaml";
import { useGetApiDetails, useListApis } from "../../Apis/hooks";
import { Loading } from "../Common/Loading";
import { RedocDisplay } from "./RedocDisplay";
import { SwaggerDisplay } from "./SwaggerDisplay";

// This is a flag to enable the backstage yaml download button.
const BACKSTAGE_YAML_DEMO_ENABLED = false;

function keyValue(theKey: string, ...theValues: (string | undefined)[]) {
  let truthyValue = "";
  for (let i = 0; i < theValues.length; i++) {
    const cur = theValues[i];
    if (cur !== undefined) {
      truthyValue = cur;
      break;
    }
  }
  if (!truthyValue) return "";
  else return theKey + ": " + truthyValue;
}

/**
 * MAIN COMPONENT
 **/
export function ApiSchemaDisplay() {
  di(useGetApiDetails, useParams, useListApis);
  const { apiId } = useParams();
  const { isLoading: isLoadingApiDetails, data: apiSchema } =
    useGetApiDetails(apiId);
  const { isLoading: isLoadingApisList, data: apisList } = useListApis();

  const backstageYaml = useMemo(() => {
    if (!BACKSTAGE_YAML_DEMO_ENABLED) return undefined;
    const apiSummary = apisList?.find((a) => a.apiId === apiId);
    if (!apiSummary || !apiSchema) return undefined;
    const meta = apiSummary.customMetadata;
    const apiSchemaYamlStr = YAML.stringify(apiSchema);
    return `apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: ${apiSummary.title.replaceAll(" ", "-")}
  description: ${apiSummary.description}
spec:
  type: openapi
  ${keyValue("owner", meta?.owner, apiSummary.contact)}
  ${keyValue("lifecycle", meta?.lifecycle, "production")}
  definition: |-
    ${
      // Add in the indents.
      apiSchemaYamlStr.replaceAll("\n", "\n    ")
    }
`;
  }, [apisList, apiSchema]);

  const isLoading = isLoadingApiDetails || isLoadingApisList;

  const [isSwagger, setIsSwagger] = useState(false);

  if (isLoading) {
    return <Loading message={`Retrieving schema for ${apiId}...`} />;
  }

  return (
    <>
      <div className="swaggerViewToggleHolder">
        <Button
          variant="subtle"
          onClick={() => setIsSwagger(!isSwagger)}
          size="xs"
        >
          {isSwagger ? "Redoc" : "Swagger"} View
        </Button>
        {backstageYaml !== undefined && (
          <a
            target="_blank"
            download={`catalog-info-${apiId}.yaml`}
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(
              backstageYaml
            )}`}
          >
            <Button variant="subtle" size="xs">
              Download Backstage YAML
            </Button>
          </a>
        )}
      </div>
      <main className="page-container-wrapper">
        {!isSwagger ? (
          //
          // Redoc - Default
          //
          <RedocDisplay spec={apiSchema} />
        ) : (
          //
          // Swagger - Alternative
          //
          <SwaggerDisplay
            spec={apiSchema}
            apiId={apiId ?? "Unsupported schema display"}
          />
        )}
      </main>
    </>
  );
}
