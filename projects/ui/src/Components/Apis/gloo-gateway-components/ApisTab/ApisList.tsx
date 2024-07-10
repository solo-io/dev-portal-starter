import { useContext, useMemo } from "react";
import { useListApiProducts } from "../../../../Apis/gg_hooks";
import { AppContext } from "../../../../Context/AppContext";
import {
  FilterPair,
  FilterType,
  parsePairString,
} from "../../../../Utility/filter-utility";
import { EmptyData } from "../../../Common/EmptyData";
import { Loading } from "../../../Common/Loading";
import { ApisPageStyles } from "../../ApisPage.style";
import { ApiSummaryGridCard } from "./ApiSummaryCards/ApiSummaryGridCard";
import { ApiSummaryListCard } from "./ApiSummaryCards/ApiSummaryListCard";

export function ApisList({
  allFilters,
  nameFilter,
}: {
  allFilters: FilterPair[];
  nameFilter: string;
}) {
  const { preferGridView } = useContext(AppContext);
  const { data: apiProductsList } = useListApiProducts();

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
          allFilters.every(
            (filter) =>
              (filter.type === FilterType.name &&
                api.name
                  .toLocaleLowerCase()
                  .includes(filter.displayName.toLocaleLowerCase())) ||
              (filter.type === FilterType.keyValuePair &&
                !!api.apiProductMetadata &&
                api.apiProductMetadata[
                  parsePairString(filter.displayName).pairKey
                ] === parsePairString(filter.displayName).value) ||
              filter.type === FilterType.apiType
          );
        return passesNameFilter && passesFilterList;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [apiProductsList, allFilters, nameFilter]);

  //
  // Render
  //
  // The SWR loading check causes the page to flicker when it's loading, even if it's just re-fetching.
  // This alternative removes flickering, but causes the loading wheel to persist.
  if (apiProductsList === undefined) {
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
