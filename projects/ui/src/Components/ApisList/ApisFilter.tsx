import { Icon } from "../../Assets/Icons";
import PageContainer from "../Common/PageContainer";

export type PairValue = { key: string; value: string };

function getPairString(pair: PairValue) {
  return `${pair.key} : ${pair.value}`;
}

type ApisFiltration = {
  showingGrid: boolean;
  setShowingGrid: (showGrid: boolean) => void;
  namesFilter: string[];
  setNamesFilter: (newNamesList: string[]) => void;
  pairsFilter: PairValue[];
  setPairsFilter: (newPairValuesList: PairValue[]) => void;
  typesFilter: string[];
  setTypesFilter: (newTypesList: string[]) => void;
};

export function ApisFilter({ filters }: { filters: ApisFiltration }) {
  const activeFilters = [
    ...filters.namesFilter.map((name) => {
      return {
        key: `NAME:${name}`,
        displayName: name,
      };
    }),
    ...filters.pairsFilter.map((pair) => {
      const pairing = getPairString(pair);

      return {
        key: `PAIR:${pairing}`,
        displayName: pairing,
      };
    }),
    ...filters.typesFilter.map((type) => {
      return {
        key: `TYPE:${type}`,
        displayName: type,
      };
    }),
  ];

  const removeFilter = (pairKey: string) => {
    const keyParts = pairKey.split(":");

    switch (keyParts[0]) {
      case "NAME": {
        filters.setNamesFilter(
          filters.namesFilter.filter((name) => name !== keyParts[1])
        );
        break;
      }
      case "PAIR": {
        filters.setPairsFilter(
          filters.pairsFilter.filter(
            (pair) => getPairString(pair) !== getPairString(keyParts[1])
          )
        );
        break;
      }
      case "TYPE": {
        filters.setTypesFilter(
          filters.typesFilter.filter((type) => type !== keyParts[1])
        );
        break;
      }
    }
  };

  const clearAll = () => {
    filters.setNamesFilter([]);
    filters.setPairsFilter([]);
    filters.setTypesFilter([]);
  };

  return (
    <div className="filterArea">
      <div>
        <div className="title">Filters</div>
        <div className="textFilter">NAME</div>
        <div className="pairsFilter">PAIRS</div>
        <div className="dropdownFilter">DROPDOWN</div>
        <div className="gridListToggle">
          <div
            className={filters.showingGrid ? "isActive" : ""}
            onClick={() => filters.setShowingGrid(true)}
          >
            <Icon.TileViewIcon />
          </div>
          <div
            className={!filters.showingGrid ? "isActive" : ""}
            onClick={() => filters.setShowingGrid(false)}
          >
            <Icon.ListViewIcon />
          </div>
        </div>
      </div>
      {activeFilters.length > 0 && (
        <div className="currentFiltersArea">
          <div className="activeFiltersGrid">
            {activeFilters.map((activeFilter) => (
              <div className="activeFilter">
                {activeFilter.displayName}{" "}
                <span
                  className="closingX"
                  aria-label={`Remove ${activeFilter.displayName} filter`}
                  onClick={() => removeFilter(activeFilter.key)}
                >
                  <Icon.SmallX />
                </span>
              </div>
            ))}
          </div>
          <div className="clearAll">
            Clear All
            <span
              className="closingX"
              aria-label={`Remove all filters`}
              onClick={clearAll}
            >
              <Icon.SmallX />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
