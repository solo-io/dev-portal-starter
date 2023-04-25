import YAML from "yaml";
import { API, APISchema } from "../Apis/api-types";

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
 * This tries to convert the API into a format that Backstage can consume.
 * For documentation on the spec, see:
 * https://backstage.io/docs/features/software-catalog/descriptor-format/#kind-api
 */
export function createBackstageYaml(apiSummary: API, apiSchema: APISchema) {
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
      // This is to add in the correct indentation.
      apiSchemaYamlStr.replaceAll("\n", "\n    ")
    }
`;
}
