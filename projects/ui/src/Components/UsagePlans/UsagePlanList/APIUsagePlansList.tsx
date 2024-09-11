import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { API } from "../../../Apis/api-types";
import { useListApis } from "../../../Apis/shared_hooks";
import { SimpleEmptyContent } from "../../Common/EmptyData";
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
  const displayedApisList = useMemo<API[]>(
    () =>
      !!apisList?.length
        ? (apisList
            .sort((apiA, apiB) =>
              apiA.title
                .toLocaleLowerCase()
                .localeCompare(apiB.title.toLocaleLowerCase())
            )
            .filter((a) => "apiId" in a) as API[])
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
        <SimpleEmptyContent title="No API Products were found." />
      )}
    </>
  );
}
