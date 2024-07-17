import { Box, Flex } from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { NavLink } from "react-router-dom";
import { Team } from "../../../../Apis/api-types";
import { useListAppsForTeam } from "../../../../Apis/gg_hooks";
import { AuthContext } from "../../../../Context/AuthContext";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { getAppDetailsLink } from "../../../../Utility/link-builders";
import { formatDateToMMDDYYYY } from "../../../../Utility/utility";
import CustomPagination, {
  pageOptions,
  useCustomPagination,
} from "../../../Common/CustomPagination";
import { EmptyData } from "../../../Common/EmptyData";
import { Loading } from "../../../Common/Loading";
import Table from "../../../Common/Table";
import ToggleAddButton from "../../../Common/ToggleAddButton";
import AddTeamAppSubSection from "./AddTeamAppSubSection";

const TeamAppsSection = ({ team }: { team: Team }) => {
  di(useListAppsForTeam);
  const { isAdmin } = useContext(AuthContext);
  const { isLoading, data: apps } = useListAppsForTeam(team);
  const [showAddTeamAppSubSection, setShowAddTeamAppSubSection] =
    useState(false);

  const customPaginationData = useCustomPagination(
    apps ?? [],
    pageOptions.table
  );
  const { paginatedData } = customPaginationData;

  const rows = useMemo(() => {
    return paginatedData?.map(
      (app) =>
        (
          <tr key={app.id}>
            <td>{app.name}</td>
            <td>{formatDateToMMDDYYYY(new Date(app.createdAt))}</td>
            <td>{formatDateToMMDDYYYY(new Date(app.updatedAt))}</td>
            <td>
              {app.deletedAt && formatDateToMMDDYYYY(new Date(app.deletedAt))}
            </td>
            {!isAdmin && (
              <td>
                <UtilityStyles.CenteredCellContent>
                  <Box mr={"-5%"}>
                    <UtilityStyles.NavLinkContainer>
                      <NavLink to={getAppDetailsLink(app)}>DETAILS</NavLink>
                    </UtilityStyles.NavLinkContainer>
                  </Box>
                </UtilityStyles.CenteredCellContent>
              </td>
            )}
          </tr>
        ) ?? []
    );
  }, [paginatedData]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <DetailsPageStyles.Section>
      <Flex justify={"space-between"}>
        <DetailsPageStyles.Title>Apps</DetailsPageStyles.Title>
        {!isAdmin && (
          <ToggleAddButton
            topicUpperCase="APP"
            isAdding={showAddTeamAppSubSection}
            toggleAdding={() =>
              setShowAddTeamAppSubSection(!showAddTeamAppSubSection)
            }
          />
        )}
      </Flex>
      {!isAdmin && (
        <AddTeamAppSubSection
          team={team}
          open={showAddTeamAppSubSection}
          onClose={() => setShowAddTeamAppSubSection(false)}
        />
      )}
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
                    {!isAdmin && (
                      <th>
                        <UtilityStyles.CenteredCellContent>
                          Details
                        </UtilityStyles.CenteredCellContent>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot>
                  <tr>
                    <td colSpan={7}>
                      <Box p=".6rem">
                        <CustomPagination
                          customPaginationData={customPaginationData}
                        />
                      </Box>
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
