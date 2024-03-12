import { useContext, useMemo } from "react";
import { di } from "react-magnetic-di";
import { useListApiProducts, useListApis } from "../../../Apis/hooks";
import { AppContext } from "../../../Context/AppContext";
import { FilterPair, FilterType } from "../../../Utility/filter-utility";
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
  const { isLoading, data: apiProductsList } = useListApiProducts();

  //
  // Filter the list of api products.
  //
  const filteredApiProductsList = useMemo(() => {
    if (!apiProductsList?.length) {
      return [];
    }
    return apiProductsList
      .filter((api) => {
        let passesNameFilter =
          !nameFilter ||
          api.name.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase());
        const passesFilterList =
          !allFilters.length ||
          allFilters.every((filter) => {
            filter.type === FilterType.name &&
              api.name
                .toLocaleLowerCase()
                .includes(filter.displayName.toLocaleLowerCase());
          });
        // api.apiVersions.some((apiVersion) => {
        //   return allFilters.every((filter) => {
        //     return (
        //       (filter.type === FilterType.name &&
        //         api.apiProductDisplayName
        //           .toLocaleLowerCase()
        //           .includes(filter.displayName.toLocaleLowerCase())) ||
        //       (filter.type === FilterType.keyValuePair &&
        //         apiVersion.customMetadata &&
        //         apiVersion.customMetadata[
        //           parsePairString(filter.displayName).pairKey
        //         ] === parsePairString(filter.displayName).value) ||
        //       (filter.type === FilterType.apiType && true) // This is the only type available for now
        //     );
        //   });
        // });
        return passesNameFilter && passesFilterList;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [apiProductsList, allFilters, nameFilter]);

  //
  // Render
  //
  if (isLoading) {
    return <Loading message="Getting list of apis..." />;
  }
  if (!filteredApiProductsList.length) {
    return <EmptyData topic="API" />;
  }
  if (preferGridView) {
    return (
      <ApisPageStyles.ApiGridList>
        {filteredApiProductsList.map((apiProduct) => (
          <ApiSummaryGridCard apiProduct={apiProduct} key={apiProduct.id} />
        ))}
      </ApisPageStyles.ApiGridList>
    );
  }
  return (
    <div>
      {filteredApiProductsList.map((apiProduct) => (
        <ApiSummaryListCard apiProduct={apiProduct} key={apiProduct.id} />
      ))}
    </div>
  );
}
