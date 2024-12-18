import { Box } from "@mantine/core";
import { useState } from "react";
import { Icon } from "../../Assets/Icons";
import { useIsAdmin } from "../../Context/AuthContext";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { PageContainer } from "../Common/PageContainer";
import CreateNewTeamModal from "./Modals/CreateNewTeamModal";
import { TeamsList } from "./TeamsList/TeamsList";

export function TeamsPage() {
  const isAdmin = useIsAdmin();
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
