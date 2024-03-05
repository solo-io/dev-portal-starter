import { useState } from "react";
import { FilterPair } from "../../../Utility/filter-utility";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { AppsFilter } from "./AppsFilter";
import { AppsList } from "./AppsList";

export function AppsPageContent() {
  const [allFilters, setAllFilters] = useState<FilterPair[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");

  const [usingGridView, setUsingGridView] = useState(false);

  const filters = {
    showingGrid: usingGridView,
    setShowingGrid: setUsingGridView,
    allFilters,
    setAllFilters,
    nameFilter,
    setNameFilter,
  };

  return (
    <div>
      <AppsFilter filters={filters} />
      <ErrorBoundary fallback="There was an issue loading the list of APIs">
        <AppsList
          allFilters={allFilters}
          nameFilter={nameFilter}
          usingGridView={usingGridView}
        />
      </ErrorBoundary>
    </div>
  );
}
