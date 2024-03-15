import { Loader } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetApiProductDetails,
  useGetApiProductVersions,
  useListApiProducts,
} from "../../Apis/hooks";
import { ApiProductDetailsPageContent } from "./ApiProductDetailsPageContent";

const URL_SEARCH_PARAMS_API_VERSION_ID = "v";

export function ApiProductDetailsPage() {
  di(useParams, useListApiProducts, useGetApiProductVersions);
  const location = useLocation();
  const { apiProductId } = useParams();
  const { isLoading: isLoadingApiProduct, data: apiProduct } =
    useGetApiProductDetails(apiProductId);
  const { isLoading: isLoadingApiProductVersions, data: apiProductVersions } =
    useGetApiProductVersions(apiProductId);

  //
  // API Version Selection
  //
  const [selectedApiVersionId, setSelectedApiVersionId] = useState(
    new URLSearchParams(location.search).get(URL_SEARCH_PARAMS_API_VERSION_ID)
  );
  // Update the URL when the selected API Version changes.
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    if (!!selectedApiVersionId) {
      newSearchParams.set(
        URL_SEARCH_PARAMS_API_VERSION_ID,
        selectedApiVersionId
      );
    } else {
      newSearchParams.delete(URL_SEARCH_PARAMS_API_VERSION_ID);
    }
    // window.location.search = `?${newSearchParams.toString()}`;
  }, [selectedApiVersionId]);

  //
  // API Version Object
  //
  const apiVersion = useMemo(() => {
    if (isLoadingApiProductVersions || apiProductVersions === undefined) {
      return null;
    }
    // Try to get the API Version object with the selected API Version ID
    // from the `apiProductVersions` list.
    let newApiVersion = apiProductVersions.find(
      (v) => v.id === selectedApiVersionId
    );
    if (newApiVersion === undefined) {
      // If we couldn't find it, try to select the first API Product version and stop here.
      if (apiProductVersions.length !== 0) {
        setSelectedApiVersionId(apiProductVersions.at(0)!.id);
      }
      return null;
    }
    // Otherwise we found it.
    return newApiVersion;
  }, [isLoadingApiProductVersions, apiProductVersions, selectedApiVersionId]);

  //
  // Render
  //
  if (
    apiProduct === undefined ||
    isLoadingApiProduct ||
    apiProductVersions === undefined ||
    isLoadingApiProductVersions
  ) {
    return <Loader />;
  }
  return (
    <ApiProductDetailsPageContent
      apiProduct={apiProduct}
      selectedApiVersion={apiVersion}
      onSelectedApiVersionChange={(newApiVersionId) =>
        setSelectedApiVersionId(newApiVersionId)
      }
      apiProductVersions={apiProductVersions}
    />
  );
}
