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
  
/*
  const isLoading = false;
  const isError = false;

  const apisList = [
    {
      apiId: "petstore-openapi-v2-full",
      contact: "example@solo.io",
      description: "A Petstore API",
      license: "MIT",
      termsOfService: "sample terms of service",
      title: "Petstore v2",
      usagePlans: ["bronze", "silver", "gold"],
      icon: <Icon.CircledKey />,
    },
    {
      apiId: "gameofthrones-characters",
      contact: "example@solo.io",
      description: "Character lists from ASOIAF",
      license: "MIT",
      termsOfService: "sample terms of service",
      title: "Game of Thrones Characters",
      usagePlans: ["bronze", "silver", "gold"],
      icon: <Icon.NetworkHub />,
    },
    {
      apiId: "Pokemon",
      contact: "example@solo.io",
      description:
        "All the Pokémon data you'll ever need in one place, easily accessible through a modern RESTful API.",
      license: "MIT",
      termsOfService: "sample terms of service",
      title: "The Pokedex",
      usagePlans: ["bronze", "silver", "gold"],
      icon: <Icon.Bug />,
    },
    {
      apiId: "tacos",
      contact: "example@solo.io",
      description: "A database of taco recipes for a large list of ingredients",
      license: "MIT",
      termsOfService: "sample terms of service",
      title: "Random Taco Recipes",
      usagePlans: ["bronze", "silver", "gold"],
      icon: <Icon.ListViewIcon />,
    },
  ];
  */

  const [allFilters, setAllFilters] = useState<FilterPair[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");

  const [usingGridView, setUsingGridView] = useState(false);

  /* eslint-disable no-console */
  //console.log(apisList);
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
    ? apisList
        .filter((api) => {
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
        .sort((filterA, filterB) => filterA.title.localeCompare(filterB.title))
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
            <div className={usingGridView ? "apiGridList" : ""}>
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
