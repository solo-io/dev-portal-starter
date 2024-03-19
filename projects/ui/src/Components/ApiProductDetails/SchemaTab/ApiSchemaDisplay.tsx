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
  apiVersionSpec,
  apiVersionId,
}: {
  apiVersionSpec: ApiVersionSchema;
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
      </PageContainerWrapper>
    </>
  );
}
