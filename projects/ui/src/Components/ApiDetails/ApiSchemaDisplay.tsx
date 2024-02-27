import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@mantine/core";
import { useContext, useState } from "react";
import { APISchema } from "../../Apis/api-types";
import { AppContext } from "../../Context/AppContext";
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

/**
 * MAIN COMPONENT
 **/
export function ApiSchemaDisplay({
  apiSchema,
  apiId,
}: {
  apiSchema: APISchema;
  apiId: string;
}) {
  const { pageContentIsWide } = useContext(AppContext);
  const [isSwagger, setIsSwagger] = useState(false);

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
