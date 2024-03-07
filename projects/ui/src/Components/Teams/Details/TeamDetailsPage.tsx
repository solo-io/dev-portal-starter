import { di } from "react-magnetic-di";
import { useParams } from "react-router-dom";
import { useGetTeamDetails } from "../../../Apis/hooks";
import { Loading } from "../../Common/Loading";
import TeamDetailsPageContent from "./TeamDetailsPageContent";

const TeamDetailsPage = () => {
  di(useParams);
  const { teamId } = useParams();
  const { isLoading, data: team } = useGetTeamDetails(teamId);

  if (isLoading || !team) {
    return <Loading />;
  }
  return <TeamDetailsPageContent team={team} />;
};

export default TeamDetailsPage;
