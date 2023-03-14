import { useParams } from "react-router-dom";
import { RedocDisplay } from "./RedocDisplay";
import { Loading } from "../Common/Loading";
import { useGetApiDetails } from "../../Apis/hooks";

export function ApiSchemaDisplay() {
  const { apiId } = useParams();

  const { isLoading, data: apiSchema } = useGetApiDetails(apiId);

  if (isLoading) {
    return <Loading message={`Retrieving schema for ${apiId}...`} />;
  }

  return <RedocDisplay url={apiSchema} />;
}
