import { useState } from "react";
import PageContainer from "../Common/PageContainer";
import { ApiSummaryGridCard } from "./ApiSummaryGridCard";
import { ApiSummaryListCard } from "./ApiSummaryListCard";
import { useQuery } from "@tanstack/react-query";
import { fetchJson, restpointPrefix } from "../../Apis/hooks";
import { API } from "../../Apis/api-types";
import {
  BannerHeading,
  BannerHeadingTitle,
} from "../Common/Banner/BannerHeading";
import { Icon } from "../../Assets/Icons";
import { ApisFilter, FilterPair, FilterType, PairValue } from "./ApisFilter";

export function Apis() {
  const {
    isLoading,
    isError,
    data: apisList,
    error,
  } = useQuery({
    queryKey: ["/apis"],
    queryFn: () => fetchJson<API[]>(`${restpointPrefix}/apis`),
  });

  const [allFilters, setAllFilters] = useState<FilterPair[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");

  const [usingGridView, setUsingGridView] = useState(false);

  /* eslint-disable no-console */
  console.log(allFilters);
  /* eslint-enable no-console */

  const filters = {
    showingGrid: usingGridView,
    setShowingGrid: setUsingGridView,
    allFilters,
    setAllFilters,
    nameFilter,
    setNameFilter,
  };

  const displayedApisList = apisList
    ? apisList.filter((api) => {
        return (
          (!nameFilter && !allFilters.length) ||
          (!!nameFilter &&
            api.title
              .toLocaleLowerCase()
              .includes(nameFilter.toLocaleLowerCase())) ||
          allFilters.some((filter) => {
            return (
              (filter.type === FilterType.name &&
                api.title
                  .toLocaleLowerCase()
                  .includes(filter.displayName.toLocaleLowerCase())) ||
              (!!filter.type === FilterType.pairValue &&
                api.customMetadata[filter.key] === filter.value) ||
              (!!filter.type === FilterType.apiType && true)
            );
          })
        );
      })
    : [];

  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"APIs"} logo={<Icon.CodeGear />} />}
        description={
          "Browse the list of APIs and documentation in this portal. From here you can get the information you need to make API calls."
        }
      />
      <main className="apisList">
        {isLoading ? (
          "Getting data..."
        ) : isError ? (
          <div>'is error'</div>
        ) : (
          <>
            <ApisFilter filters={filters} />
            <div>
              {usingGridView
                ? displayedApisList.map((api) => (
                    <ApiSummaryGridCard api={api} key={api.apiId} />
                  ))
                : displayedApisList.map((api) => (
                    <ApiSummaryListCard api={api} key={api.apiId} />
                  ))}
            </div>
          </>
        )}
      </main>
    </PageContainer>
  );
}
