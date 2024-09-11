import { Box } from "@mantine/core";
import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { API } from "../../../Apis/api-types";
import { useListApis } from "../../../Apis/shared_hooks";
import CustomPagination, {
  pageOptions,
  useCustomPagination,
} from "../../Common/CustomPagination";
import { SimpleEmptyContent } from "../../Common/EmptyData";
import { Loading } from "../../Common/Loading";
import { ApiSummaryGridCard } from "./ApiSummaryGridCard";
import { ApiSummaryListCard } from "./ApiSummaryListCard";
import { FilterPair, FilterType, parsePairString } from "./ApisFilter";

/**
 * MAIN COMPONENT
 **/
export function ApisList({
  allFilters,
  nameFilter,
  usingGridView,
}: {
  allFilters: FilterPair[];
  nameFilter: string;
  usingGridView: boolean;
}) {
  di(useListApis);
  const { isLoading, data: apisList } = useListApis();

  // We can say this is an API[] since if we get here, the portal server is GMG.
  const displayedApisList: API[] = useMemo(() => {
    if (!apisList) {
      return [];
    }
    return apisList
      .filter((api) => {
        return (
          "apiId" in api &&
          (!nameFilter ||
            api.title
              .toLocaleLowerCase()
              .includes(nameFilter.toLocaleLowerCase())) &&
          (!allFilters.length ||
            allFilters.every((filter) => {
              return (
                (filter.type === FilterType.name &&
                  api.title
                    .toLocaleLowerCase()
                    .includes(filter.displayName.toLocaleLowerCase())) ||
                (filter.type === FilterType.keyValuePair &&
                  api.customMetadata &&
                  api.customMetadata[
                    parsePairString(filter.displayName).pairKey
                  ] === parsePairString(filter.displayName).value) ||
                (filter.type === FilterType.apiType && true) // This is the only type available for now
              );
            }))
        );
      })
      .sort((a, b) => a.title.localeCompare(b.title)) as API[];
  }, [apisList, allFilters, nameFilter]);

  const customPaginationData = useCustomPagination(
    displayedApisList,
    pageOptions.fullPage
  );
  const { paginatedData } = customPaginationData;

  if (isLoading) {
    return <Loading message="Getting list of apis..." />;
  }

  if (!displayedApisList.length) {
    return (
      <SimpleEmptyContent title="No APIs were found matching these filters." />
    );
  }
  return (
    <>
      <Box mb="30px" className={usingGridView ? "apiGridList" : ""}>
        {usingGridView
          ? paginatedData.map((api) => (
              <ApiSummaryGridCard api={api} key={api.apiId} />
            ))
          : paginatedData.map((api) => (
              <ApiSummaryListCard api={api} key={api.apiId} />
            ))}
      </Box>
      <CustomPagination customPaginationData={customPaginationData} />
    </>
  );
}
