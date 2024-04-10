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

  return (
    <>
      {filters.allFilters.length > 0 && (
        <div className="currentFiltersArea">
          <Styles.ActiveFiltersGrid>
            {filters.allFilters.map((activeFilter, idx) => (
              <Styles.ActiveFilter key={idx}>
                {activeFilter.displayName}
                <button
                  className="closingX"
                  aria-label={`Remove ${activeFilter.displayName} filter`}
                  onClick={() => removeFilter(activeFilter)}
                >
                  <Icon.SmallX />
                </button>
              </Styles.ActiveFilter>
            ))}
          </Styles.ActiveFiltersGrid>
          <Styles.ClearAllButton
            aria-label={`Remove all filters`}
            onClick={clearAll}
          >
            Clear All
            <span className="closingX">
              <Icon.SmallX />
            </span>
          </Styles.ClearAllButton>
        </div>
      )}
    </>
  );
};
