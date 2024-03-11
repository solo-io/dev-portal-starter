import { Box, Button, Flex } from "@mantine/core";
import { useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { Team } from "../../../../Apis/api-types";
import { useListAppsForTeam } from "../../../../Apis/hooks";
import { Icon } from "../../../../Assets/Icons";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { EmptyData } from "../../../Common/EmptyData";
import { Loading } from "../../../Common/Loading";
import Pagination, { usePagination } from "../../../Common/Pagination";
import Table from "../../../Common/Table";
import AddTeamAppSubSection from "./AddTeamAppSubsection";

const AddTeamAppButton = (props: typeof Button.defaultProps) => {
  return (
    <Button {...props} variant="subtle">
      <UtilityStyles.StyledButtonContentsWithIcon>
        ADD APP
        <Icon.PlusIcon />
      </UtilityStyles.StyledButtonContentsWithIcon>
    </Button>
  );
};

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
            <td>{app.id}</td>
            <td>{app.name}</td>
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
        <AddTeamAppButton onClick={() => setShowAddTeamAppSubSection(true)} />
      </Flex>
      {showAddTeamAppSubSection && (
        <AddTeamAppSubSection
          onClose={() => setShowAddTeamAppSubSection(false)}
        />
      )}
      {!apps?.length ? (
        <Box mb={"-30px"}>
          <EmptyData topic="App" />
        </Box>
      ) : (
        <GridCardStyles.GridCard whiteBg>
          <Box p={"20px"}>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
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
      )}
    </DetailsPageStyles.Section>
  );
};

export default TeamAppsSection;
