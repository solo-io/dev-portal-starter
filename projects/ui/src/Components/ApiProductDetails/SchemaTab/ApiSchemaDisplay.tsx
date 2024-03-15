import { Button } from "@mantine/core";
import { useContext, useState } from "react";
import { ApiVersionSchema } from "../../../Apis/api-types";
import { AppContext } from "../../../Context/AppContext";
import { PageContainerWrapper } from "../../Common/PageContainer";
import { ApiProductDetailsPageStyles as Styles } from "../ApiProductDetailsPage.style";
import { RedocDisplay } from "./redoc/RedocDisplay";
import { SwaggerDisplay } from "./swagger/SwaggerDisplay";

/**
 * MAIN COMPONENT
 **/
export function ApiSchemaDisplay({
  apiVersionSchema,
  apiVersionId,
}: {
  apiVersionSchema: ApiVersionSchema;
  apiVersionId: string;
}) {
  const { pageContentIsWide } = useContext(AppContext);
  const [isSwagger, setIsSwagger] = useState(false);

  return (
    <>
      <Styles.SwaggerViewToggleHolder>
        <Button
          variant="subtle"
          onClick={() => setIsSwagger(!isSwagger)}
          size="xs"
        >
          {isSwagger ? "Redoc" : "Swagger"} View
        </Button>
      </Styles.SwaggerViewToggleHolder>
      <PageContainerWrapper pageContentIsWide={pageContentIsWide}>
        {!isSwagger ? (
          //
          // Redoc - Default
          //
          <RedocDisplay apiVersionSchema={apiVersionSchema} />
        ) : (
          //
          // Swagger - Alternative
          //
          <SwaggerDisplay
            apiVersionSchema={apiVersionSchema}
            apiVersionId={apiVersionId ?? "Unsupported schema display"}
          />
        )}
      </PageContainerWrapper>
    </>
  );
}
