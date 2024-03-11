import { Box } from "@mantine/core";
import { useMemo } from "react";
import { Team } from "../../../../Apis/api-types";
import { useListMembersForTeam } from "../../../../Apis/hooks";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { EmptyData } from "../../../Common/EmptyData";
import { Loading } from "../../../Common/Loading";
import Pagination, { usePagination } from "../../../Common/Pagination";
import Table from "../../../Common/Table";

const TeamUsersSection = ({ team }: { team: Team }) => {
  const { isLoading, data: members } = useListMembersForTeam(team.id);

  const {
    paginatedDataSlice: paginatedMembers,
    onPageChange,
    totalPages,
  } = usePagination(members, 5);

  const rows = useMemo(() => {
    return paginatedMembers?.map(
      (member) =>
        (
          <tr key={member.id}>
            <td>{member.email}</td>
            <td>{member.username}</td>
            <td>{member.name}</td>
            <td>{member.synced}</td>
          </tr>
        ) ?? []
    );
  }, [paginatedMembers]);

  if (isLoading) {
    return <Loading />;
  }
  if (!members?.length) {
    return <EmptyData topic="Members" />;
  }
  return (
    <DetailsPageStyles.Section>
      <DetailsPageStyles.Title>Users</DetailsPageStyles.Title>
      <GridCardStyles.GridCard whiteBg>
        <Box p={"20px"}>
          <Table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Name</th>
                <th>Synced (confirmed?)</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>
                  <Pagination
                    dataCount={members.length}
                    totalPages={totalPages}
                    onChange={onPageChange}
                  />
                </td>
              </tr>
            </tfoot>
          </Table>
        </Box>
      </GridCardStyles.GridCard>
    </DetailsPageStyles.Section>
  );
};

export default TeamUsersSection;
