import { Loader } from "@mantine/core";
import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { useParams } from "react-router-dom";
import { useListApis } from "../../Apis/hooks";
import { ApiDetailsPageContent } from "./ApiDetailsPageContent";

export function ApiDetailsPage() {
  di(useParams, useListApis);
  const { apiProductId, apiVersion } = useParams();

  const { data: apisList } = useListApis();

  const apiProductObject = useMemo(() => {
    return apisList?.find((api) => api.apiProductId === apiProductId);
  }, [apisList, apiProductId]);

  const apiVersionObject = useMemo(() => {
    return apiProductObject?.apiVersions.find(
      (v) => v.apiVersion === apiVersion
    );
  }, [apiProductObject, apiVersion]);

  if (!apiProductObject || !apiVersionObject) {
    return <Loader />;
  }
  return (
    <ApiDetailsPageContent
      api={apiProductObject}
      apiVersion={apiVersionObject}
    />
  );
}
