import { Box } from "@mantine/core";
import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { App, Team } from "../../../Apis/api-types";
import { useListAppsForTeams } from "../../../Apis/gg_hooks";
import { FilterPair, FilterType } from "../../../Utility/filter-utility";
import { omitErrorMessageResponse } from "../../../Utility/utility";
import { EmptyData } from "../../Common/EmptyData";
import { Loading } from "../../Common/Loading";
import { AppsPageStyles } from "../AppsPage.style";
import { AppSummaryGridCard } from "./AppSummaryCards/AppSummaryGridCard";

export type AppWithTeam = App & { team: Team };

export function AppsList({
  teams,
  allFilters,
  nameFilter,
}: {
  teams: Team[];
  allFilters: FilterPair[];
  nameFilter: string;
}) {
  di(useListAppsForTeams);
  // This is the App[][] of apps per team.
  const { isLoading, data: appsListPerTeam } = useListAppsForTeams(teams);
  // This is the flattened AppWithTeam[] that includes team information.
  const appsList = useMemo<AppWithTeam[]>(() => {
    if (!appsListPerTeam) {
      return [];
    }
    const newAppsWithTeamsList: AppWithTeam[] = [];
    for (let i = 0; i < appsListPerTeam.length; i++) {
      const appsListForCurTeam = omitErrorMessageResponse(appsListPerTeam[i]);
      if (!appsListForCurTeam) {
        continue;
      }
      for (let j = 0; j < appsListForCurTeam.length; j++) {
        newAppsWithTeamsList.push({
          ...appsListForCurTeam[j],
          team: teams[i],
        });
      }
    }
    return newAppsWithTeamsList;
  }, [appsListPerTeam]);

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
          app.name
            .toLocaleLowerCase()
            .includes(nameFilter.toLocaleLowerCase()) ||
          app.team.name
            .toLocaleLowerCase()
            .includes(nameFilter.toLocaleLowerCase());
        const passesFilterList = allFilters.every((filter) => {
          return (
            (filter.type === FilterType.name &&
              (app.name
                .toLocaleLowerCase()
                .includes(filter.displayName.toLocaleLowerCase()) ||
                app.team.name
                  .toLocaleLowerCase()
                  .includes(filter.displayName.toLocaleLowerCase()))) ||
            (filter.type === FilterType.team &&
              app.team.name === filter.displayName)
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
  if (!appsList?.length) {
    return <EmptyData title="No Apps were found." />;
  }
  if (!filteredAppsList.length) {
    return <EmptyData title="No Apps were found matching these filters." />;
  }
  return (
    <Box mb="30px">
      <AppsPageStyles.AppGridList>
        {filteredAppsList.map((api) => (
          <AppSummaryGridCard app={api} key={api.id} />
        ))}
      </AppsPageStyles.AppGridList>
    </Box>
  );
}
