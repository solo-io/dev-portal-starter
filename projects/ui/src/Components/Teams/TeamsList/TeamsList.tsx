import { Box, Flex } from "@mantine/core";
import { di } from "react-magnetic-di";
import { useListTeams } from "../../../Apis/gg_hooks";
import { EmptyData } from "../../Common/EmptyData";
import { Loading } from "../../Common/Loading";
import { TeamSummaryGridCard } from "./TeamSummaryCards/TeamSummaryGridCard";

export function TeamsList() {
  di(useListTeams);
  const { isLoading, data: teamsList } = useListTeams();

  //
  // Render
  //
  if (teamsList === undefined || isLoading) {
    return <Loading message="Getting list of teams..." />;
  }
  if (!teamsList.length) {
    return <EmptyData topic="team" />;
  }
  return (
    <Box mb="30px">
      <Flex gap="30px" wrap={"wrap"}>
        {teamsList.map((team) => (
          <TeamSummaryGridCard team={team} key={team.id} />
        ))}
      </Flex>
    </Box>
  );
}
