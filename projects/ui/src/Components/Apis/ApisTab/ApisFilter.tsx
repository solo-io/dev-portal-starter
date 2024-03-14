import { Select, TextInput } from "@mantine/core";
import { useContext } from "react";
import { Icon } from "../../../Assets/Icons";
import { AppContext } from "../../../Context/AppContext";
import { FilterStyles as Styles } from "../../../Styles/shared/Filters.style";
import { FilterPair, FilterType } from "../../../Utility/filter-utility";
import GridListToggle from "../../Common/GridListToggle";

type ApisFiltrationProp = {
  allFilters: FilterPair[];
  setAllFilters: (newFiltersList: FilterPair[]) => void;
  nameFilter: string;
  setNameFilter: (newNamesList: string) => void;
};

export function ApisFilter({ filters }: { filters: ApisFiltrationProp }) {
  const { preferGridView, setPreferGridView } = useContext(AppContext);

  // const [pairFilter, setPairFilter] = useState<KeyValuePair>({
  //   pairKey: "",
  //   value: "",
  // });

  const addNameFilter = (evt: { target: { value: string } }) => {
    const displayName = evt.target.value;
    // Check for duplicate filters.
    const isDuplicateFilter = filters.allFilters.some(
      (f) => f.type === FilterType.name && f.displayName === displayName
    );
    if (isDuplicateFilter) {
      return;
    }
    if (evt.target.value !== "") {
      filters.setAllFilters([
        ...filters.allFilters,
        { displayName, type: FilterType.name },
      ]);
    }
    filters.setNameFilter("");
  };

  // const alterPairKey = (evt: React.ChangeEvent<HTMLInputElement>) => {
  //   const newKey = evt.target.value;
  //   setPairFilter({
  //     pairKey: newKey,
  //     value: pairFilter.value,
  //   });
  // };
  // const alterKeyValuePair = (evt: React.ChangeEvent<HTMLInputElement>) => {
  //   const newValue = evt.target.value;
  //   setPairFilter({
  //     pairKey: pairFilter.pairKey,
  //     value: newValue,
  //   });
  // };

  // const addKeyValuePairFilter = () => {
  //   const displayName = getPairString(pairFilter);
  //   if (displayName.trim() === ":") return;
  //   // Check for duplicate filters.
  //   const isDuplicateFilter = filters.allFilters.some(
  //     (f) => f.type === FilterType.keyValuePair && f.displayName === displayName
  //   );
  //   if (isDuplicateFilter) {
  //     return;
  //   }
  //   filters.setAllFilters([
  //     ...filters.allFilters,
  //     { displayName, type: FilterType.keyValuePair },
  //   ]);

  //   setPairFilter({ pairKey: "", value: "" });
  // };

  const addTypeFilter = (addedType: string) => {
    filters.setAllFilters([
      ...filters.allFilters,
      { displayName: addedType, type: FilterType.apiType },
    ]);
  };

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

  const selectableTypes = [
    {
      label: "OpenAPI",
      value: "OpenAPI",
    },
  ].filter(
    (selectableType) =>
      !filters.allFilters.some(
        (filter) =>
          filter.type === FilterType.apiType &&
          filter.displayName === selectableType.value
      )
  );

  return (
    <Styles.FilterArea>
      <div className="choicesArea">
        <h3 className="title">Filters</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNameFilter({ target: { value: filters.nameFilter } });
          }}
          className="textFilter"
        >
          <TextInput
            placeholder="Filter by name or keyword"
            onChange={(e) => filters.setNameFilter(e.target.value)}
            onBlur={addNameFilter}
            value={filters.nameFilter}
          />
          <Icon.MagnifyingGlass style={{ pointerEvents: "none" }} />
        </form>
        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            addKeyValuePairFilter();
          }}
          className="pairsFilter"
        >
          <div className="tagHolder">
            <Icon.Tag />
          </div>
          <div className="pairHolder">
            <TextInput
              size="xs"
              placeholder="Key"
              onChange={alterPairKey}
              value={pairFilter.pairKey}
            />
            <span>:</span>
            <TextInput
              size="xs"
              placeholder="Value"
              onChange={alterKeyValuePair}
              value={pairFilter.value}
            />
          </div>
          <div className="addButtonHolder">
            <button type="submit" aria-label="Add Pair Filter">
              <Icon.Add />
            </button>
          </div>
        </form> */}
        <div className="dropdownFilter">
          <div className="gearHolder">
            <Icon.CodeGear />
          </div>
          <Select
            className="addTypeFilterSelect"
            size="xs"
            disabled={(selectableTypes ?? []).length === 0}
            data={selectableTypes}
            onChange={addTypeFilter}
            value=""
            placeholder="API Type"
          />
        </div>
        <GridListToggle
          onChange={(newIsList) => setPreferGridView(!newIsList)}
          isList={!preferGridView}
        />
      </div>

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
    </Styles.FilterArea>
  );
}
