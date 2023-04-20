import { Button } from "@mantine/core";
import { useState } from "react";
import { di } from "react-magnetic-di";
import { useParams } from "react-router-dom";
import { useGetApiDetails } from "../../Apis/hooks";
import { Loading } from "../Common/Loading";
import { RedocDisplay } from "./RedocDisplay";
import { SwaggerDisplay } from "./SwaggerDisplay";

/**
 * MAIN COMPONENT
 **/
export function ApiSchemaDisplay() {
  di(useGetApiDetails, useParams);
  const { apiId } = useParams();
  const { isLoading, data: apiSchema } = useGetApiDetails(apiId);
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
