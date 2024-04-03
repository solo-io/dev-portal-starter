import { Box } from "@mantine/core";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTeamDetails } from "../../../Apis/hooks";
import { Loading } from "../../Common/Loading";
import TeamDetailsPageContent from "./TeamDetailsPageContent";

const TeamDetailsPage = () => {
  di(useParams, useGetTeamDetails);
  const navigate = useNavigate();
  const { teamId } = useParams();
  const { isLoading, data: team, error } = useGetTeamDetails(teamId);

  useEffect(() => {
    if (!!error?.message) {
      toast.error(error.message);
      navigate("/");
    }
  }, [error?.message]);

  if (isLoading || !team) {
    return (
      <Box p={"60px"}>
        <Loading />
      </Box>
    );
  }
  return <TeamDetailsPageContent team={team} />;
};

export default TeamDetailsPage;
