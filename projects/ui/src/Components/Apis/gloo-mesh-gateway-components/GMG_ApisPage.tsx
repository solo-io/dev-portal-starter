import { useState } from "react";
import { Icon } from "../../../Assets/Icons";
import { apisImageURL } from "../../../user_variables.tmplr";
import { BannerHeading } from "../../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../../Common/Banner/BannerHeadingTitle";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { PageContainer } from "../../Common/PageContainer";
import { ApisFilter, FilterPair } from "./ApisFilter";
import { ApisList } from "./ApisList";
import { StyledApisListMain } from "./ApisPage.style";

/**
 * MAIN COMPONENT
 **/
export function GMG_ApisPage() {
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
        bgImageURL={apisImageURL}
        title={<BannerHeadingTitle text={"APIs"} logo={<Icon.CodeGear />} />}
        description={
          "Browse the list of APIs and documentation in this portal. From here you can get the information you need to make API calls."
        }
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "APIs" }]}
      />
      <StyledApisListMain>
        <ApisFilter filters={filters} />
        <ErrorBoundary fallback="There was an issue loading the list of APIs">
          <ApisList
            allFilters={allFilters}
            nameFilter={nameFilter}
            usingGridView={usingGridView}
          />
        </ErrorBoundary>
      </StyledApisListMain>
    </PageContainer>
  );
}
