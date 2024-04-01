import { Box, Flex } from "@mantine/core";
import { useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { NavLink } from "react-router-dom";
import { Team } from "../../../../Apis/api-types";
import { useListAppsForTeam } from "../../../../Apis/hooks";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { getAppDetailsLink } from "../../../../Utility/link-builders";
import { formatDateToMMDDYYYY } from "../../../../Utility/utility";
import { EmptyData } from "../../../Common/EmptyData";
import { Loading } from "../../../Common/Loading";
import Pagination, { usePagination } from "../../../Common/Pagination";
import Table from "../../../Common/Table";
import ToggleAddButton from "../../../Common/ToggleAddButton";
import AddTeamAppSubSection from "./AddTeamAppSubSection";

const TeamAppsSection = ({ team }: { team: Team }) => {
  di(useListAppsForTeam);
  const { isLoading, data: apps } = useListAppsForTeam(team);
  const [showAddTeamAppSubSection, setShowAddTeamAppSubSection] =
    useState(false);

  const {
    paginatedDataSlice: paginatedApps,
    onPageChange,
    totalPages,
  } = usePagination(apps, 5);

  const rows = useMemo(() => {
    return paginatedApps?.map(
      (app) =>
        (
          <tr key={app.id}>
            <td>{app.name}</td>
            <td>{formatDateToMMDDYYYY(new Date(app.createdAt))}</td>
            <td>{formatDateToMMDDYYYY(new Date(app.updatedAt))}</td>
            <td>
              {app.deletedAt && formatDateToMMDDYYYY(new Date(app.deletedAt))}
            </td>
            <UtilityStyles.CenteredTD>
              <Box mr={"-2%"}>
                <UtilityStyles.NavLinkContainer>
                  <NavLink to={getAppDetailsLink(app)}>DETAILS</NavLink>
                </UtilityStyles.NavLinkContainer>
              </Box>
            </UtilityStyles.CenteredTD>
          </tr>
        ) ?? []
    );
  }, [paginatedApps]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <DetailsPageStyles.Section>
      <Flex justify={"space-between"}>
        <DetailsPageStyles.Title>Apps</DetailsPageStyles.Title>
        <ToggleAddButton
          topicUpperCase="APP"
          isAdding={showAddTeamAppSubSection}
          toggleAdding={() =>
            setShowAddTeamAppSubSection(!showAddTeamAppSubSection)
          }
        />
      </Flex>
      <AddTeamAppSubSection
        team={team}
        open={showAddTeamAppSubSection}
        onClose={() => setShowAddTeamAppSubSection(false)}
      />
      {!apps?.length ? (
        <Box mb={"-30px"} mt={"30px"}>
          <EmptyData topic="App" />
        </Box>
      ) : (
        <Box pt={"5px"}>
          <GridCardStyles.GridCard whiteBg wide>
            <Box p={"20px"}>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Deleted</th>
                    <UtilityStyles.CenteredTH>Details</UtilityStyles.CenteredTH>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}>
                      <Pagination
                        dataCount={apps.length}
                        totalPages={totalPages}
                        onChange={onPageChange}
                      />
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Box>
          </GridCardStyles.GridCard>
        </Box>
      )}
    </DetailsPageStyles.Section>
  );
};

export default TeamAppsSection;
