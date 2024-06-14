import { di } from "react-magnetic-di";
import { useParams } from "react-router-dom";
import { useGetAppDetails } from "../../../Apis/gg_hooks";
import { Loading } from "../../Common/Loading";
import { AppDetailsPageContent } from "./AppDetailsPageContent";

const AppDetailsPage = () => {
  di(useParams);
  const { appId } = useParams();
  const { isLoading, data: app } = useGetAppDetails(appId);

  if (isLoading || !app) {
    return <Loading />;
  }
  return <AppDetailsPageContent app={app} />;
};

export default AppDetailsPage;
