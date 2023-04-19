import { Select, TextInput } from "@mantine/core";
import { useState } from "react";
import { Icon } from "../../Assets/Icons";
import { KeyValuePair } from "../Common/DataPairPill";
import GridListToggle from "../Common/GridListToggle";

/**
 * HELPER TYPE DEFS
 **/
export enum FilterType {
  name,
  keyValuePair,
  apiType,
}
export type FilterPair = { displayName: string; type: FilterType };

/**
 * HELPER FUNCTION
 **/
function getPairString(pair: KeyValuePair) {
  return `${pair.pairKey} : ${pair.value}`;
}
export function parsePairString(pairString: string): KeyValuePair {
  const [pairKey, value] = pairString.split(":").map((s) => s.trim());
  return {
    pairKey,
    value,
  };
}

/**
 * MAIN COMPONENT
 **/
type ApisFiltrationProp = {
  showingGrid: boolean;
  allFilters: FilterPair[];
  setAllFilters: (newFiltersList: FilterPair[]) => void;
  setShowingGrid: (showGrid: boolean) => void;
  nameFilter: string;
  setNameFilter: (newNamesList: string) => void;
};

export function ApisFilter({ filters }: { filters: ApisFiltrationProp }) {
  const [pairFilter, setPairFilter] = useState<KeyValuePair>({
    pairKey: "",
    value: "",
  });

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

  const alterPairKey = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = evt.target.value;
    setPairFilter({
      pairKey: newKey,
      value: pairFilter.value,
    });
  };
  const alterKeyValuePair = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.target.value;
    setPairFilter({
      pairKey: pairFilter.pairKey,
      value: newValue,
    });
  };

  const addKeyValuePairFilter = () => {
    const displayName = getPairString(pairFilter);
    if (displayName.trim() === ":") return;
    // Check for duplicate filters.
    const isDuplicateFilter = filters.allFilters.some(
      (f) => f.type === FilterType.keyValuePair && f.displayName === displayName
    );
    if (isDuplicateFilter) {
      return;
    }
    filters.setAllFilters([
      ...filters.allFilters,
      { displayName, type: FilterType.keyValuePair },
    ]);

    setPairFilter({ pairKey: "", value: "" });
  };

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
    <div className="filterArea">
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
        <form
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
        </form>
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
          onChange={(newIsList) => filters.setShowingGrid(!newIsList)}
          isList={!filters.showingGrid}
        />
      </div>

      {filters.allFilters.length > 0 && (
        <div className="currentFiltersArea">
          <div className="activeFiltersGrid">
            {filters.allFilters.map((activeFilter, idx) => (
              <div key={idx} className="activeFilter">
                {activeFilter.displayName}
                <button
                  className="closingX"
                  aria-label={`Remove ${activeFilter.displayName} filter`}
                  onClick={() => removeFilter(activeFilter)}
                >
                  <Icon.SmallX />
                </button>
              </div>
            ))}
          </div>
          <button
            aria-label={`Remove all filters`}
            className="clearAll"
            onClick={clearAll}
          >
            Clear All
            <span className="closingX">
              <Icon.SmallX />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
