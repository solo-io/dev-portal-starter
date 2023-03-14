import { useState } from "react";
import PageContainer from "../Common/PageContainer";
import {
  BannerHeading,
  BannerHeadingTitle,
} from "../Common/Banner/BannerHeading";
import { Icon } from "../../Assets/Icons";
import { ApisFilter, FilterPair, FilterType } from "./ApisFilter";
import { ApisList } from "./ApisList";
import { ErrorBoundary } from "../Common/ErrorBoundary";

export function ApisPage() {
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
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"APIs"} logo={<Icon.CodeGear />} />}
        description={
          "Browse the list of APIs and documentation in this portal. From here you can get the information you need to make API calls."
        }
      />
      <main className="apisList">
        <ApisFilter filters={filters} />
        <ErrorBoundary fallback="There was an issue loading the list of APIs">
          <ApisList
            allFilters={allFilters}
            nameFilter={nameFilter}
            usingGridView={usingGridView}
          />
        </ErrorBoundary>
      </main>
    </PageContainer>
  );
}
