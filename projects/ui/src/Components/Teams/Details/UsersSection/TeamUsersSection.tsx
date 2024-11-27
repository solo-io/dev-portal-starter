import { Box, Flex } from "@mantine/core";
import { useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { Member, Team } from "../../../../Apis/api-types";
import {
  useGetCurrentUser,
  useListMembersForTeam,
} from "../../../../Apis/hooks";
import { Icon } from "../../../../Assets/Icons";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { formatDateToMMDDYYYY } from "../../../../Utility/utility";
import { Button } from "../../../Common/Button";
import { EmptyData } from "../../../Common/EmptyData";
import { Loading } from "../../../Common/Loading";
import Pagination, { usePagination } from "../../../Common/Pagination";
import Table from "../../../Common/Table";
import ToggleAddButton from "../../../Common/ToggleAddButton";
import ConfirmRemoveTeamMemberModal from "../Modals/ConfirmRemoveTeamMemberModal";
import AddTeamUserSubSection from "./AddTeamUserSubSection";

const TeamUsersSection = ({ team }: { team: Team }) => {
  di(useListMembersForTeam);
  const { isLoading, data: members } = useListMembersForTeam(team.id);
  const [showAddTeamUserSubSection, setShowAddTeamUserSubSection] =
    useState(false);
  const { data: user } = useGetCurrentUser();

  const {
    paginatedDataSlice: paginatedMembers,
    onPageChange,
    totalPages,
  } = usePagination(members, 5);

  const [confirmRemoveTeamMember, setConfirmRemoveTeamMember] =
    useState<Member>();

  const rows = useMemo(() => {
    return (
      paginatedMembers?.map((member) => (
        <tr key={member.id}>
          <td>{member.email}</td>
          <td>{member.username}</td>
          <td>{member.name}</td>
          <td>{formatDateToMMDDYYYY(new Date(member.createdAt))}</td>
          <td>{formatDateToMMDDYYYY(new Date(member.updatedAt))}</td>
          <td>
            <UtilityStyles.CenteredCellContent>
              <Box sx={{ position: "absolute" }}>
                {member.synced ? <Icon.SmallGreenCheck /> : <Icon.SmallRedX />}
              </Box>
            </UtilityStyles.CenteredCellContent>
          </td>
          <td>
            <UtilityStyles.CenteredCellContent>
              <Button
                size="xs"
                variant="light"
                color="danger"
                disabled={!!member.deletedAt || user?.email === member.email}
                onClick={() => setConfirmRemoveTeamMember(member)}
              >
                REMOVE
              </Button>
            </UtilityStyles.CenteredCellContent>
          </td>
        </tr>
      )) ?? []
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
                    <th>
                      <UtilityStyles.CenteredCellContent>
                        Confirmed Login
                      </UtilityStyles.CenteredCellContent>
                    </th>
                    <th>
                      <UtilityStyles.CenteredCellContent>
                        Remove from Team
                      </UtilityStyles.CenteredCellContent>
                    </th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot>
                  <tr>
                    <td colSpan={7}>
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
      <ConfirmRemoveTeamMemberModal
        open={!!confirmRemoveTeamMember}
        userId={confirmRemoveTeamMember?.id ?? ""}
        teamId={team.id}
        onClose={() => setConfirmRemoveTeamMember(undefined)}
      />
    </DetailsPageStyles.Section>
  );
};

export default TeamUsersSection;
