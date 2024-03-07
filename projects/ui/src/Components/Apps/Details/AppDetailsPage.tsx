import { di } from "react-magnetic-di";
import { useParams } from "react-router-dom";

const AppDetailsPage = () => {
  di(useParams);
  const { appId } = useParams();
  return <div>AppDetailsPage {appId}</div>;
};

export default AppDetailsPage;
