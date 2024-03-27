import { Box, Flex } from "@mantine/core";
import { useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { Team } from "../../../../Apis/api-types";
import { useListMembersForTeam } from "../../../../Apis/hooks";
import { Icon } from "../../../../Assets/Icons";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { formatDateToMMDDYYYY } from "../../../../Utility/utility";
import { EmptyData } from "../../../Common/EmptyData";
import { Loading } from "../../../Common/Loading";
import Pagination, { usePagination } from "../../../Common/Pagination";
import Table from "../../../Common/Table";
import ToggleAddButton from "../../../Common/ToggleAddButton";
import AddTeamUserSubSection from "./AddTeamUserSubSection";

const TeamUsersSection = ({ team }: { team: Team }) => {
  di(useListMembersForTeam);
  const { isLoading, data: members } = useListMembersForTeam(team.id);
  const [showAddTeamUserSubSection, setShowAddTeamUserSubSection] =
    useState(false);

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
            <td>{formatDateToMMDDYYYY(new Date(member.createdAt))}</td>
            <td>{formatDateToMMDDYYYY(new Date(member.updatedAt))}</td>
            <UtilityStyles.CenteredTD>
              {member.synced ? <Icon.SmallGreenCheck /> : <Icon.SmallRedX />}
            </UtilityStyles.CenteredTD>
          </tr>
        ) ?? []
    );
  }, [paginatedMembers]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <DetailsPageStyles.Section>
      <Flex justify={"space-between"}>
        <DetailsPageStyles.Title>Users</DetailsPageStyles.Title>
        <ToggleAddButton
          topicUpperCase="USER"
          isAdding={showAddTeamUserSubSection}
          toggleAdding={() =>
            setShowAddTeamUserSubSection(!showAddTeamUserSubSection)
          }
        />
      </Flex>
      <AddTeamUserSubSection
        team={team}
        open={showAddTeamUserSubSection}
        onClose={() => setShowAddTeamUserSubSection(false)}
      />
      {!members?.length ? (
        <Box mb={"-30px"}>
          <EmptyData topic="Members" />
        </Box>
      ) : (
        <Box pt={"5px"}>
          <GridCardStyles.GridCard whiteBg wide>
            <Box p={"20px"}>
              <Table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <UtilityStyles.CenteredTH>
                      Confirmed Login
                    </UtilityStyles.CenteredTH>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot>
                  <tr>
                    <td colSpan={6}>
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
        </Box>
      )}
    </DetailsPageStyles.Section>
  );
};

export default TeamUsersSection;
