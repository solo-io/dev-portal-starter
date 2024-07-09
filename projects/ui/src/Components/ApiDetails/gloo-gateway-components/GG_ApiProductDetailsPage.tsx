import { useEffect, useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetApiProductVersions,
  useListApiProducts,
} from "../../../Apis/gg_hooks";
import { ApiProductDetailsPageContent } from "./ApiProductDetailsPageContent";

const URL_SEARCH_PARAMS_API_VERSION_ID_KEY = "v";

export function GG_ApiProductDetailsPage() {
  di(useParams, useListApiProducts, useGetApiProductVersions);
  const location = useLocation();
  const navigate = useNavigate();
  const { id: apiProductId } = useParams();
  // The details call doesn't return the full information (metadata, etc)
  // const { isLoading: isLoadingApiProduct, data: apiProduct } =
  //   useGetApiProductDetails(apiProductId);
  const { isLoading: isLoadingApiProduct, data: apiProducts } =
    useListApiProducts();
  const apiProduct = useMemo(
    () => apiProducts?.find((a) => a.id === apiProductId),
    [apiProducts]
  );
  const { isLoading: isLoadingApiProductVersions, data: apiProductVersions } =
    useGetApiProductVersions(apiProductId);

  //
  // API Version Selection
  //
  const [selectedApiVersionId, setSelectedApiVersionId] = useState(
    new URLSearchParams(location.search).get(
      URL_SEARCH_PARAMS_API_VERSION_ID_KEY
    )
  );
  // Update the URL when the selected API Version changes.
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    if (!!selectedApiVersionId) {
      newSearchParams.set(
        URL_SEARCH_PARAMS_API_VERSION_ID_KEY,
        selectedApiVersionId
      );
    }
    navigate(location.pathname + `?${newSearchParams.toString()}`, {
      replace: true,
    });
  }, [selectedApiVersionId, location.search]);

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
    return null;
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
