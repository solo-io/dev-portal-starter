import { Box } from "@mantine/core";
import { useContext, useState } from "react";
import { Icon } from "../../Assets/Icons";
import { AuthContext } from "../../Context/AuthContext";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { PageContainer } from "../Common/PageContainer";
import CreateNewTeamModal from "./Modals/CreateNewTeamModal";
import { TeamsList } from "./TeamsList/TeamsList";

export function TeamsPage() {
  const { isAdmin } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Teams"} logo={<Icon.TeamsIcon />} />}
        description={
          <>
            Browse the list of teams.
            {!isAdmin && (
              <Box pt={"20px"}>
                <Button onClick={() => setModalOpen(true)}>
                  CREATE NEW TEAM
                </Button>
              </Box>
            )}
          </>
        }
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Teams" }]}
      />
      <Box px={"30px"} pb={"10px"}>
        <TeamsList />
      </Box>
      {!isAdmin && (
        <CreateNewTeamModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </PageContainer>
  );
}
