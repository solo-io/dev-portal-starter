import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { useListApps } from "../../../Apis/hooks";
import { FilterPair, FilterType } from "../../../Utility/filter-utility";
import { EmptyData } from "../../Common/EmptyData";
import { Loading } from "../../Common/Loading";
import { AppsPageStyles } from "../AppsPage.style";
import { AppSummaryGridCard } from "./AppSummaryCards/AppSummaryGridCard";
import { AppSummaryListCard } from "./AppSummaryCards/AppSummaryListCard";

export function AppsList({
  allFilters,
  nameFilter,
  usingGridView,
}: {
  allFilters: FilterPair[];
  nameFilter: string;
  usingGridView: boolean;
}) {
  di(useListApps);
  const { isLoading, data: appsList } = useListApps(
    "8e543407-cfdb-4061-b3ac-841faa715edf"
  );

  //
  // Filter the list of apps.
  //
  const filteredAppsList = useMemo(() => {
    if (!appsList?.length) {
      return [];
    }
    return appsList
      .filter((app) => {
        let passesNameFilter =
          !nameFilter ||
          app.name.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase());
        const passesFilterList = allFilters.every((filter) => {
          return (
            filter.type === FilterType.name &&
            app.name
              .toLocaleLowerCase()
              .includes(filter.displayName.toLocaleLowerCase())
            // ||
            // (filter.type === FilterType.keyValuePair &&
            //   apiVersion.customMetadata &&
            //   apiVersion.customMetadata[
            //     parsePairString(filter.displayName).pairKey
            //   ] === parsePairString(filter.displayName).value) ||
            // (filter.type === FilterType.apiType && true) // This is the only type available for now
          );
        });
        return passesNameFilter && passesFilterList;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [appsList, allFilters, nameFilter]);

  //
  // Render
  //
  if (isLoading) {
    return <Loading message="Getting list of apps..." />;
  }
  if (!filteredAppsList.length) {
    return <EmptyData topic="app" />;
  }
  if (usingGridView) {
    return (
      <AppsPageStyles.AppGridList>
        {filteredAppsList.map((api) => (
          <AppSummaryGridCard app={api} key={api.id} />
        ))}
      </AppsPageStyles.AppGridList>
    );
  }
  return (
    <div>
      {filteredAppsList.map((app) => (
        <AppSummaryListCard app={app} key={app.id} />
      ))}
    </div>
  );
}
