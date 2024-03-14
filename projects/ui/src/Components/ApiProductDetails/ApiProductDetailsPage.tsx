import { Loader } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { useLocation, useParams } from "react-router-dom";
import { useGetApiProductDetails, useListApiProducts } from "../../Apis/hooks";
import { ApiProductDetailsPageContent } from "./ApiProductDetailsPageContent";

const URL_SEARCH_PARAMS_API_VERSION_ID = "v";

export function ApiProductDetailsPage() {
  di(useParams, useListApiProducts);
  const location = useLocation();
  const { apiProductId } = useParams();
  const { isLoading: isLoadingApiProduct, data: apiProduct } =
    useGetApiProductDetails(apiProductId);

  //
  // API Version Selection
  //
  const [selectedApiVersion, setSelectedApiVersion] = useState(
    new URLSearchParams(location.search).get(URL_SEARCH_PARAMS_API_VERSION_ID)
  );
  // Update the URL when the selected API Version changes.
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    if (!!selectedApiVersion) {
      newSearchParams.set(URL_SEARCH_PARAMS_API_VERSION_ID, selectedApiVersion);
    } else {
      newSearchParams.delete(URL_SEARCH_PARAMS_API_VERSION_ID);
    }
    // window.location.search = `?${newSearchParams.toString()}`;
  }, [selectedApiVersion]);

  //
  // API Version Object
  //
  const apiVersion = useMemo(() => {
    if (isLoadingApiProduct || !apiProduct) {
      return null;
    }
    // eslint-disable-next-line no-console
    console.log(apiProduct);
    // Try to get the API Version object with the selected API Version ID
    // from the `apiProduct.apiVersion` list.
    let newApiVersion = apiProduct.versions?.find(
      (v) => v.id === selectedApiVersion
    );
    if (!newApiVersion) {
      // If we couldn't find it, try to select the first api Product version and stop here.
      // setSelectedApiVersion(apiProduct.versions.at(0)?.id ?? null);
      return null;
    }
    // Otherwise we found it.
    return newApiVersion;
  }, [isLoadingApiProduct, apiProduct, selectedApiVersion]);

  //
  // Render
  //
  if (!apiProduct || isLoadingApiProduct) {
    return <Loader />;
  }
  // if (!apiProduct.versions?.length) {
  //   return (
  //     <Box m="60px">
  //       <EmptyData topicMessageOverride="This API Product has no API Version data." />
  //     </Box>
  //   );
  // }
  if (!apiVersion && !!apiProduct.versions?.length) {
    // This is only returned when the apiVersion is being assigned to.
    return null;
  }
  return (
    <ApiProductDetailsPageContent
      apiProduct={apiProduct}
      apiVersion={apiVersion}
    />
  );
}
