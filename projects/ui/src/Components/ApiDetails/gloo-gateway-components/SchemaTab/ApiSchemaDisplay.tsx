import { useState } from "react";
import { ApiVersionSchema } from "../../../../Apis/api-types";
import { Button } from "../../../Common/Button";
import { RedocDisplay } from "../../shared/ApiSchema/redoc/RedocDisplay";
import { SwaggerDisplay } from "../../shared/ApiSchema/swagger/SwaggerDisplay";
import { ApiProductDetailsPageStyles as Styles } from "../ApiProductDetailsPage.style";

/**
 * MAIN COMPONENT
 **/
export function ApiSchemaDisplay({
  apiVersionSpec,
  apiVersionId,
}: {
  apiVersionSpec: ApiVersionSchema;
  apiVersionId: string;
}) {
  const [isSwagger, setIsSwagger] = useState(false);

  return (
    <>
      <Styles.SwaggerViewToggleHolder>
        <Button
          variant="subtle"
          onClick={() => setIsSwagger(!isSwagger)}
          size="sm"
        >
          {isSwagger ? "Redoc" : "Swagger"} View
        </Button>
      </Styles.SwaggerViewToggleHolder>
      {!isSwagger ? (
        //
        // Redoc - Default
        //
        <RedocDisplay apiVersionSpec={apiVersionSpec} />
      ) : (
        //
        // Swagger - Alternative
        //
        <SwaggerDisplay
          apiVersionSpec={apiVersionSpec}
          apiVersionId={apiVersionId ?? "Unsupported schema display"}
        />
      )}
    </>
  );
}
