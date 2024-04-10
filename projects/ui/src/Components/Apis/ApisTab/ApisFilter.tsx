import { Select, TextInput } from "@mantine/core";
import { useContext } from "react";
import { Icon } from "../../../Assets/Icons";
import { AppContext } from "../../../Context/AppContext";
import { FilterStyles as Styles } from "../../../Styles/shared/Filters.style";
import { FilterType } from "../../../Utility/filter-utility";
import {
  AppliedFiltersSection,
  FiltrationProp,
} from "../../Common/Filters/AppliedFiltersSection";
import GridListToggle from "../../Common/GridListToggle";

export function ApisFilter({ filters }: { filters: FiltrationProp }) {
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
      <AppliedFiltersSection filters={filters} />
    </Styles.FilterArea>
  );
}
