import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Box, Button } from "@mantine/core";
import { useContext, useState } from "react";
import { di } from "react-magnetic-di";
import { useParams } from "react-router";
import { useGetApiDetails } from "../../../Apis/gmg_hooks";
import { AppContext } from "../../../Context/AppContext";
import { EmptyData } from "../../Common/EmptyData";
import { Loading } from "../../Common/Loading";
import { PageContainerWrapper } from "../../Common/PageContainer";
import { RedocDisplay } from "../shared/ApiSchema/redoc/RedocDisplay";
import { SwaggerDisplay } from "../shared/ApiSchema/swagger/SwaggerDisplay";

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

/**
 * MAIN COMPONENT
 **/
export function ApiSchemaDisplay() {
  di(useGetApiDetails, useParams);
  const { id: apiId } = useParams();
  const { isLoading: isLoadingApiDetails, data: apiSchema } =
    useGetApiDetails(apiId);
  const isLoading = isLoadingApiDetails;
  const { pageContentIsWide } = useContext(AppContext);

  const [isSwagger, setIsSwagger] = useState(false);

  if (isLoading) {
    return <Loading message={`Retrieving schema for ${apiId}...`} />;
  }
  // The request finished without a spec we can render. Say so, rather than
  // handing Redoc an undefined spec and leaving it on "Loading ..." forever.
  if (!apiSchema) {
    return (
      <Box m="60px">
        <EmptyData title="No schema found.">
          The portal server returned no usable OpenAPI spec for this API. Check
          that it generated correctly.
        </EmptyData>
      </Box>
    );
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
      </SwaggerViewToggleHolder>
      <PageContainerWrapper pageContentIsWide={pageContentIsWide}>
        {!isSwagger ? (
          //
          // Redoc - Default
          //
          <RedocDisplay apiVersionSpec={apiSchema} />
        ) : (
          //
          // Swagger - Alternative
          //
          <SwaggerDisplay
            apiVersionSpec={apiSchema}
            apiVersionId={apiId ?? "Unsupported schema display"}
          />
        )}
      </PageContainerWrapper>
    </>
  );
}
