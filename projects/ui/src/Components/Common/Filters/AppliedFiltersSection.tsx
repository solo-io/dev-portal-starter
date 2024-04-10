import { Icon } from "../../../Assets/Icons";
import { FilterStyles as Styles } from "../../../Styles/shared/Filters.style";
import { FilterPair } from "../../../Utility/filter-utility";

export type FiltrationProp = {
  allFilters: FilterPair[];
  setAllFilters: (newFiltersList: FilterPair[]) => void;
  nameFilter: string;
  setNameFilter: (newNamesList: string) => void;
};

export const AppliedFiltersSection = ({
  filters,
}: {
  filters: FiltrationProp;
}) => {
  const removeFilter = (filterPair: FilterPair) => {
    filters.setAllFilters(
      filters.allFilters.filter(
        (filter) =>
          filter.type !== filterPair.type ||
          filter.displayName !== filterPair.displayName
      )
    );
  };

  const clearAll = () => {
    filters.setAllFilters([]);
  };

  if (filters.allFilters.length === 0) {
    return null;
  }
  return (
    <Styles.AppliedFiltersArea>
      <Styles.ActiveFiltersGrid>
        {filters.allFilters.map((activeFilter, idx) => (
          <Styles.ActiveFilter key={idx}>
            {activeFilter.displayName}
            <Styles.CloseFilterButton
              aria-label={`Remove ${activeFilter.displayName} filter`}
              onClick={() => removeFilter(activeFilter)}
            >
              <Icon.SmallX />
            </Styles.CloseFilterButton>
          </Styles.ActiveFilter>
        ))}
      </Styles.ActiveFiltersGrid>
      <Styles.ClearAllButton
        aria-label={`Remove all filters`}
        onClick={clearAll}
      >
        Clear All
        <Icon.SmallX />
      </Styles.ClearAllButton>
    </Styles.AppliedFiltersArea>
  );
};
