import { useState } from "react";
import { di } from "react-magnetic-di";
import { useListTeams } from "../../../Apis/gg_hooks";
import { FilterPair } from "../../../Utility/filter-utility";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { Loading } from "../../Common/Loading";
import { AppsFilter } from "./AppsFilter";
import { AppsList } from "./AppsList";

export function AppsPageContent() {
  di(useListTeams);
  const { isLoading, data: teams } = useListTeams();

  const [allFilters, setAllFilters] = useState<FilterPair[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");

  const filters = {
    allFilters,
    setAllFilters,
    nameFilter,
    setNameFilter,
    teamFilter,
    setTeamFilter,
  };

  return (
    <div>
      <ErrorBoundary fallback="There was an issue loading the list of Apps">
        {isLoading || teams === undefined ? (
          // Make sure the teams are finished loading since they are a dependency.
          <Loading message="Loading..." />
        ) : (
          <>
            <AppsFilter filters={filters} teams={teams} />
            <AppsList
              teams={teams}
              allFilters={allFilters}
              nameFilter={nameFilter}
            />
          </>
        )}
      </ErrorBoundary>
    </div>
  );
}
