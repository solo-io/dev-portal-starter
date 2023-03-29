import { useListApis } from "../../../Apis/hooks";
import { EmptyData } from "../../Common/EmptyData";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { Loading } from "../../Common/Loading";
import { APIUsagePlanCard } from "./APIUsagePlanCard";

/**
 * MAIN COMPONENT
 **/
export function APIUsagePlansList() {
  const { isLoading, data: apisList } = useListApis();

  if (isLoading) {
    return <Loading message="Getting list of APIs..." />;
  }

  // No filtering to do here, but let's make sure the ordering
  //   stays consistent.
  const displayedApisList = apisList
    ? apisList.sort((apiA, apiB) =>
        apiA.title
          .toLocaleLowerCase()
          .localeCompare(apiB.title.toLocaleLowerCase())
      )
    : [];

  return displayedApisList.length ? (
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
  );
}
