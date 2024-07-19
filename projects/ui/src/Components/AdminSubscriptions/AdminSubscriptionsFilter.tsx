import { Box, Select, TextInput } from "@mantine/core";
import { useMemo } from "react";
import { SubscriptionStatus, Team } from "../../Apis/api-types";
import { Icon } from "../../Assets/Icons";
import { FilterStyles as Styles } from "../../Styles/shared/Filters.style";
import { FilterType } from "../../Utility/filter-utility";
import { capitalize, getEnumValues } from "../../Utility/utility";
import {
  AppliedFiltersSection,
  FiltrationProp,
} from "../Common/Filters/AppliedFiltersSection";

export function AdminSubscriptionsFilter({
  filters,
  teams,
}: {
  filters: FiltrationProp;
  teams: Team[];
}) {
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
        { displayName, type: FilterType.name, value: displayName },
      ]);
    }
    filters.setNameFilter("");
  };

  const addTeamFilter = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      return;
    }
    // Remove the other team filters, since there can only be one team filter.
    const newFilters = filters.allFilters.filter(
      (f) => f.type !== FilterType.team
    );
    // Add this team filter.
    filters.setAllFilters([
      ...newFilters,
      { displayName: team.name, type: FilterType.team, value: team.id },
    ]);
  };

  const addStatusFilter = (value: string) => {
    // Only one subscriptionStatus filter should be set at a time.
    const newFilters = filters.allFilters.filter(
      (f) => f.type !== FilterType.subscriptionStatus
    );
    filters.setAllFilters([
      ...newFilters,
      { displayName: value, type: FilterType.subscriptionStatus, value: value },
    ]);
  };

  const selectableTeams = useMemo(
    () =>
      teams.map((t) => ({
        label: t.name,
        value: t.id,
        disabled: filters.allFilters.some(
          (filter) => filter.type === FilterType.team && filter.value === t.id
        ),
      })),
    [teams, filters]
  );

  const selectableStatuses = useMemo(
    () =>
      getEnumValues(SubscriptionStatus).map((v) => {
        const capitalValue = capitalize(v);
        return {
          label: capitalValue,
          value: capitalValue,
          disabled: filters.allFilters.some(
            (filter) =>
              filter.type === FilterType.subscriptionStatus &&
              filter.value === capitalValue
          ),
        };
      }),
    [filters]
  );

  return (
    <Box px="30px">
      <Styles.FilterArea>
        <div className="choicesArea">
          <div className="title">Filters</div>
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
          <div className="dropdownFilter">
            <div className="gearHolder">
              <Icon.TeamsIcon />
            </div>
            <Select
              size="xs"
              disabled={(selectableTeams ?? []).length === 0}
              data={selectableTeams}
              onChange={addTeamFilter}
              value=""
              placeholder="Team"
            />
          </div>
          <div className="dropdownFilter">
            <div className="gearHolder">
              <Icon.SuccessCheckmark />
            </div>
            <Select
              size="xs"
              data={selectableStatuses}
              onChange={addStatusFilter}
              value=""
              placeholder="Status"
            />
          </div>
        </div>

        <AppliedFiltersSection filters={filters} />
      </Styles.FilterArea>
    </Box>
  );
}
