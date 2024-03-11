import { Box } from "@mantine/core";
import { useMemo } from "react";
import { di } from "react-magnetic-di";
import { Team } from "../../../../Apis/api-types";
import { useListAppsForTeam } from "../../../../Apis/hooks";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { EmptyData } from "../../../Common/EmptyData";
import { Loading } from "../../../Common/Loading";
import Pagination, { usePagination } from "../../../Common/Pagination";
import Table from "../../../Common/Table";

const TeamAppsSection = ({ team }: { team: Team }) => {
  di(useListAppsForTeam);
  const { isLoading, data: apps } = useListAppsForTeam(team);

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
      <DetailsPageStyles.Title>Apps</DetailsPageStyles.Title>
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
