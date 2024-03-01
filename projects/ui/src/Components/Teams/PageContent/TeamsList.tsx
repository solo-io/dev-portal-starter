import { di } from "react-magnetic-di";
import { useListTeams } from "../../../Apis/hooks";
import { EmptyData } from "../../Common/EmptyData";
import { Loading } from "../../Common/Loading";
import { TeamsPageStyles } from "../TeamsPage.style";
import { TeamSummaryGridCard } from "./TeamSummaryCards/TeamSummaryGridCard";

export function TeamsList() {
  di(useListTeams);
  const { isLoading, data: teamsList } = useListTeams();

  //
  // Render
  //
  if (isLoading) {
    return <Loading message="Getting list of teams..." />;
  }
  if (!teamsList?.length) {
    return <EmptyData topic="team" />;
  }
  return (
    <TeamsPageStyles.TeamGridList>
      {teamsList.map((team) => (
        <TeamSummaryGridCard team={team} key={team.id} />
      ))}
    </TeamsPageStyles.TeamGridList>
  );
}
