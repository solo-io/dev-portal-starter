import { useMemo } from "react";
import { di } from "react-magnetic-di";
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
  di(useListApis);
  const { isLoading, data: apisList } = useListApis();

  const filteredApisList = useMemo(() => {
    if (!apisList?.length) {
      return [];
    }
    return apisList
      .filter((api) => {
        let passesNameFilter =
          !nameFilter ||
          api.apiProductDisplayName
            .toLocaleLowerCase()
            .includes(nameFilter.toLocaleLowerCase());
        const passesFilterList =
          !allFilters.length ||
          api.apiVersions.some((apiVersion) => {
            return allFilters.every((filter) => {
              return (
                (filter.type === FilterType.name &&
                  api.apiProductDisplayName
                    .toLocaleLowerCase()
                    .includes(filter.displayName.toLocaleLowerCase())) ||
                (filter.type === FilterType.keyValuePair &&
                  apiVersion.customMetadata &&
                  apiVersion.customMetadata[
                    parsePairString(filter.displayName).pairKey
                  ] === parsePairString(filter.displayName).value) ||
                (filter.type === FilterType.apiType && true) // This is the only type available for now
              );
            });
          });
        return passesNameFilter && passesFilterList;
      })
      .sort((a, b) =>
        a.apiProductDisplayName.localeCompare(b.apiProductDisplayName)
      );
  }, [apisList, allFilters, nameFilter]);

  if (isLoading) {
    return <Loading message="Getting list of apis..." />;
  }

  return filteredApisList.length ? (
    <div className={usingGridView ? "apiGridList" : ""}>
      {usingGridView
        ? filteredApisList.map((api) => (
            <ApiSummaryGridCard api={api} key={api.apiProductId} />
          ))
        : filteredApisList.map((api) => (
            <ApiSummaryListCard api={api} key={api.apiProductId} />
          ))}
    </div>
  ) : (
    <EmptyData topic="API" />
  );
}
