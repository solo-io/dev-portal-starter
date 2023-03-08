import { Icon } from "../../Assets/Icons";
import { Input, Dropdown, MenuProps } from "antd";
import PageContainer from "../Common/PageContainer";
import { useState } from "react";

export type PairValue = { key: string; value: string };

export enum FilterType {
  name,
  pairValue,
  apiType,
}
export type FilterPair = { displayName: string; type: FilterType };

function getPairString(pair: PairValue) {
  return `${pair.key} : ${pair.value}`;
}

type ApisFiltration = {
  showingGrid: boolean;
  allFilters: FilterPair[];
  setAllFilters: (newFiltersList: FilterPair[]) => void;
  setShowingGrid: (showGrid: boolean) => void;
  nameFilter: string;
  setNameFilter: (newNamesList: string) => void;
};

export function ApisFilter({ filters }: { filters: ApisFiltration }) {
  const [pairFilter, setPairFilter] = useState<PairValue>({
    key: "",
    value: "",
  });

  const addNameFilter = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.value !== "") {
      filters.setAllFilters([
        ...filters.allFilters,
        { displayName: evt.target.value, type: FilterType.name },
      ]);
    }
    filters.setNameFilter("");
  };

  const alterPairKey = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = evt.target.value;
    setPairFilter({
      key: newKey,
      value: pairFilter.value,
    });
  };
  const alterPairValue = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.target.value;
    setPairFilter({
      key: pairFilter.key,
      value: newValue,
    });
  };

  const addPairValueFilter = () => {
    filters.setAllFilters([
      ...filters.allFilters,
      { displayName: getPairString(pairFilter), type: FilterType.pairValue },
    ]);

    setPairFilter({ key: "", value: "" });
  };

  const addTypeFilter: MenuProps["onClick"] = ({ key }) => {
    filters.setAllFilters([
      ...filters.allFilters,
      { displayName: key, type: FilterType.apiType },
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

  const selectableTypes: MenuProps["items"] = [
    {
      label: "OpenAPI",
      key: "OpenAPI",
    },
  ].filter(
    (selectableType) =>
      !filters.allFilters.some(
        (filter) =>
          filter.type === FilterType.apiType &&
          filter.displayName === selectableType.key
      )
  );

  return (
    <div className="filterArea">
      <div className="choicesArea">
        <h3 className="title">Filters</h3>
        <div className="textFilter">
          <Input
            placeholder="Filter by name or keyword"
            onChange={(e) => filters.setNameFilter(e.target.value)}
            onBlur={addNameFilter}
            value={filters.nameFilter}
          />
          <Icon.MagnifyingGlass />
        </div>
        <div className="pairsFilter">
          <div className="tagHolder">
            <Icon.Tag />
          </div>
          <div className="pairHolder">
            <Input
              placeholder="Key"
              onChange={alterPairKey}
              value={pairFilter.key}
            />
            <span>:</span>
            <Input
              placeholder="Value"
              onChange={alterPairValue}
              value={pairFilter.value}
            />
          </div>
          <div className="addButtonHolder">
            <button aria-label="Add Pair Filter" onClick={addPairValueFilter}>
              <Icon.Add />
            </button>
          </div>
        </div>
        <div className="dropdownFilter">
          <div className="gearHolder">
            <Icon.CodeGear />
          </div>
          <Dropdown
            disabled={selectableTypes.length === 0}
            trigger={"click"}
            menu={{
              items: selectableTypes,
              onClick: addTypeFilter,
              onSelect: addTypeFilter,
            }}
          >
            <div
              className="dropdownTrigger"
              onClick={(e) => e.preventDefault()}
            >
              <span>API Type </span> <Icon.DownArrow />
            </div>
          </Dropdown>
        </div>
        <div className="gridListToggle">
          <button
            aria-hidden="true"
            className={`listingTypeToggle ${
              filters.showingGrid ? "isActive" : ""
            }`}
            onClick={() => filters.setShowingGrid(true)}
          >
            <Icon.TileViewIcon />
          </button>
          <button
            aria-hidden="true"
            className={`listingTypeToggle ${
              !filters.showingGrid ? "isActive" : ""
            }`}
            onClick={() => filters.setShowingGrid(false)}
          >
            <Icon.ListViewIcon />
          </button>
        </div>
      </div>

      {filters.allFilters.length > 0 && (
        <div className="currentFiltersArea">
          <div className="activeFiltersGrid">
            {filters.allFilters.map((activeFilter) => (
              <div className="activeFilter">
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
          <div className="clearAll">
            Clear All
            <button
              className="closingX"
              aria-label={`Remove all filters`}
              onClick={clearAll}
            >
              <Icon.SmallX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
