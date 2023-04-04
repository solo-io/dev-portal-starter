import { useParams } from "react-router-dom";
//import { RedocDisplay } from "./RedocDisplay";
import { Loading } from "../Common/Loading";
import { useGetApiDetails } from "../../Apis/hooks";
import { SwaggerDisplay } from "./SwaggerDisplay";

/**
 * MAIN COMPONENT
 **/
export function ApiSchemaDisplay() {
  const { apiId } = useParams();

  const { isLoading, data: apiSchema } = useGetApiDetails(apiId);

  if (isLoading) {
    return <Loading message={`Retrieving schema for ${apiId}...`} />;
  }

  /** Redoc - Default */
  //return <RedocDisplay spec={apiSchema} />;

  /**
   * Swagger - Alternative
   */
  return <SwaggerDisplay spec={apiSchema} apiId={apiId} />;
}
