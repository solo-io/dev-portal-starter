import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { useParams } from "react-router-dom";
import { useGetApiDetails, useListApis } from "../../Apis/hooks";
import { AppContext } from "../../Context/AppContext";
import { createBackstageYaml } from "../../Utility/backstage_demo_utility";
import { downloadFile } from "../../Utility/utility";
import { Loading } from "../Common/Loading";
import { PageContainerWrapper } from "../Common/PageContainer";
import { RedocDisplay } from "./RedocDisplay";
import { SwaggerDisplay } from "./SwaggerDisplay";

const SwaggerViewToggleHolder = styled.div(
  ({ theme }) => css`
    width: calc(100vw - 16px);
    max-width: 1920px;
    padding: 0px 30px 5px 0px;
    margin: 0 auto;
    display: block;
    text-align: right;
    button {
      color: ${theme.primary};
    }
  `
);

// This is a flag to enable the backstage yaml download button.
const BACKSTAGE_YAML_DEMO_ENABLED = false;

/**
 * MAIN COMPONENT
 **/
export function ApiSchemaDisplay() {
  di(useGetApiDetails, useParams, useListApis);
  const { apiId } = useParams();
  const { isLoading: isLoadingApiDetails, data: apiSchema } =
    useGetApiDetails(apiId);
  const { isLoading: isLoadingApisList, data: apisList } = useListApis();
  const isLoading = isLoadingApiDetails || isLoadingApisList;
  const { pageContentIsWide } = useContext(AppContext);

  const backstageYaml = useMemo(() => {
    if (!BACKSTAGE_YAML_DEMO_ENABLED) return undefined;
    const apiSummary = apisList?.find((a) => a.apiId === apiId);
    if (!apiSummary || !apiSchema) return undefined;
    return createBackstageYaml(apiSummary, apiSchema);
  }, [apisList, apiSchema]);

  const [isSwagger, setIsSwagger] = useState(false);

  if (isLoading) {
    return <Loading message={`Retrieving schema for ${apiId}...`} />;
  }

  return (
    <>
      <SwaggerViewToggleHolder>
        <Button
          variant="subtle"
          onClick={() => setIsSwagger(!isSwagger)}
          size="xs"
        >
          {isSwagger ? "Redoc" : "Swagger"} View
        </Button>
        {backstageYaml !== undefined && (
          <Button
            variant="subtle"
            onClick={() =>
              downloadFile(`catalog-info-${apiId}.yaml`, backstageYaml)
            }
            size="xs"
          >
            Download Backstage YAML
          </Button>
        )}
      </SwaggerViewToggleHolder>
      <PageContainerWrapper pageContentIsWide={pageContentIsWide}>
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
      </PageContainerWrapper>
    </>
  );
}
