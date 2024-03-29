import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { useListApis } from "../../../Apis/hooks";
import { EmptyData } from "../../Common/EmptyData";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { Loading } from "../../Common/Loading";
import { APIUsagePlanCard } from "./APIUsagePlanCard";

/**
 * MAIN COMPONENT
 **/
export function APIUsagePlansList() {
  di(useListApis);
  const { isLoading, data: apisList } = useListApis();

  // No filtering to do here, but let's make sure the ordering
  //   stays consistent.
  const displayedApisList = useMemo(
    () =>
      !!apisList?.length
        ? apisList.sort((apiA, apiB) =>
            apiA.title
              .toLocaleLowerCase()
              .localeCompare(apiB.title.toLocaleLowerCase())
          )
        : [],
    [apisList]
  );

  if (isLoading) {
    return <Loading message="Getting list of APIs..." />;
  }

  return (
    <>
      {displayedApisList.length ? (
        displayedApisList.map((api) => (
          <ErrorBoundary
            key={api.apiId}
            fallback="There was an issue loading the list of Plans"
          >
            <APIUsagePlanCard api={api} />
          </ErrorBoundary>
        ))
      ) : (
        <EmptyData topic="API" />
      )}
    </>
  );
}
