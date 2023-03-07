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
import { ApisFilter, PairValue } from "./ApisFilter";

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

  const [namesFilter, setNamesFilter] = useState<string[]>([]);
  const [pairsFilter, setPairsFilter] = useState<PairValue[]>([]);
  const [typesFilter, setTypesFilter] = useState<string[]>([]);

  const [usingGridView, setUsingGridView] = useState(false);

  /* eslint-disable no-console */
  console.log(error, apisList);
  /* eslint-enable no-console */

  const filters = {
    showingGrid: usingGridView,
    setShowingGrid: setUsingGridView,
    namesFilter,
    setNamesFilter,
    pairsFilter,
    setPairsFilter,
    typesFilter,
    setTypesFilter,
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
        {isLoading ? (
          "Getting data..."
        ) : isError ? (
          <div>'is error'</div>
        ) : (
          <>
            <ApisFilter filters={filters} />
            <div onClick={() => setUsingGridView((s) => !s)}>FILTERS</div>
            <div>
              {usingGridView
                ? apisList.map((api) => (
                    <ApiSummaryGridCard api={api} key={api.apiId} />
                  ))
                : apisList.map((api) => (
                    <ApiSummaryListCard api={api} key={api.apiId} />
                  ))}
            </div>
          </>
        )}
      </main>
    </PageContainer>
  );
}
