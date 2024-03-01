import { useState } from "react";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { ApisFilter, FilterPair } from "./ApisFilter";
import { ApisList } from "./ApisList";

export function ApisTabContent() {
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
      <ApisFilter filters={filters} />
      <ErrorBoundary fallback="There was an issue loading the list of APIs">
        <ApisList
          allFilters={allFilters}
          nameFilter={nameFilter}
          usingGridView={usingGridView}
        />
      </ErrorBoundary>
    </div>
  );
}
