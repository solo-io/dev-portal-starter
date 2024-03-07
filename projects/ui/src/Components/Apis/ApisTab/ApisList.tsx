import { useContext, useMemo } from "react";
import { di } from "react-magnetic-di";
import { useListApis } from "../../../Apis/hooks";
import { AppContext } from "../../../Context/AppContext";
import {
  FilterPair,
  FilterType,
  parsePairString,
} from "../../../Utility/filter-utility";
import { EmptyData } from "../../Common/EmptyData";
import { Loading } from "../../Common/Loading";
import { ApisPageStyles } from "../ApisPage.style";
import { ApiSummaryGridCard } from "./ApiSummaryCards/ApiSummaryGridCard";
import { ApiSummaryListCard } from "./ApiSummaryCards/ApiSummaryListCard";

export function ApisList({
  allFilters,
  nameFilter,
}: {
  allFilters: FilterPair[];
  nameFilter: string;
}) {
  di(useListApis);
  const { preferGridView } = useContext(AppContext);
  const { isLoading, data: apisList } = useListApis();

  //
  // Filter the list of api products.
  //
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

  //
  // Render
  //
  if (isLoading) {
    return <Loading message="Getting list of apis..." />;
  }
  if (!filteredApisList.length) {
    return <EmptyData topic="API" />;
  }
  if (preferGridView) {
    return (
      <ApisPageStyles.ApiGridList>
        {filteredApisList.map((api) => (
          <ApiSummaryGridCard api={api} key={api.apiProductId} />
        ))}
      </ApisPageStyles.ApiGridList>
    );
  }
  return (
    <div>
      {filteredApisList.map((api) => (
        <ApiSummaryListCard api={api} key={api.apiProductId} />
      ))}
    </div>
  );
}
