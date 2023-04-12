import { useListApis } from "../../Apis/hooks";
import { EmptyData } from "../Common/EmptyData";
import { Loading } from "../Common/Loading";
import { ApiSummaryGridCard } from "./ApiSummaryGridCard";
import { ApiSummaryListCard } from "./ApiSummaryListCard";
import { FilterPair, FilterType, parsePairString } from "./ApisFilter";

/**
 * MAIN COMPONENT
 **/
export function ApisList({
  allFilters,
  nameFilter,
  usingGridView,
}: {
  allFilters: FilterPair[];
  nameFilter: string;
  usingGridView: boolean;
}) {
  const { isLoading, data: apisList } = useListApis();

  if (isLoading) {
    return <Loading message="Getting list of apis..." />;
  }

  const displayedApisList = apisList
    ? apisList
        .filter((api) => {
          return (
            (!nameFilter ||
              api.title
                .toLocaleLowerCase()
                .includes(nameFilter.toLocaleLowerCase())) &&
            (!allFilters.length ||
              allFilters.every((filter) => {
                return (
                  (filter.type === FilterType.name &&
                    api.title
                      .toLocaleLowerCase()
                      .includes(filter.displayName.toLocaleLowerCase())) ||
                  (filter.type === FilterType.keyValuePair &&
                    api.customMetadata &&
                    api.customMetadata.get(
                      parsePairString(filter.displayName).pairKey
                    ) === parsePairString(filter.displayName).value) ||
                  (filter.type === FilterType.apiType && true) // This is the only type available for now
                );
              }))
          );
        })
        .sort((filterA, filterB) => filterA.title.localeCompare(filterB.title))
    : [];

  return displayedApisList.length ? (
    <div className={usingGridView ? "apiGridList" : ""}>
      {usingGridView
        ? displayedApisList.map((api) => (
            <ApiSummaryGridCard api={api} key={api.apiId} />
          ))
        : displayedApisList.map((api) => (
            <ApiSummaryListCard api={api} key={api.apiId} />
          ))}
    </div>
  ) : (
    <EmptyData topic="API" />
  );
}
