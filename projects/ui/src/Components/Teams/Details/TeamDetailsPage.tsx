import { di } from "react-magnetic-di";
import { useParams } from "react-router-dom";

const TeamDetailsPage = () => {
  di(useParams);
  const { teamId } = useParams();
  return <div>TeamDetailsPage {teamId}</div>;
};

export default TeamDetailsPage;
