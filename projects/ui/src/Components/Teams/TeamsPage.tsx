import { Box } from "@mantine/core";
import { useState } from "react";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { PageContainer } from "../Common/PageContainer";
import { useInArea } from "../../Utility/utility";
import CreateNewTeamModal from "./Modals/CreateNewTeamModal";
import { TeamsList } from "./TeamsList/TeamsList";

export function TeamsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  // This page is served at both /teams and /admin/teams (AdminTeamsPage
  // re-exports it), and the portal server scopes the team list to the caller
  // on one and returns every team on the other. Derive the wording from the
  // route rather than from `useIsAdmin`, so it describes what is on screen
  // rather than who is looking at it.
  const inAdminArea = useInArea(["/admin/teams"]);

  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Teams"} logo={<Icon.TeamsIcon />} />}
        description={
          <>
            {inAdminArea
              ? "Browse all teams in this portal."
              : "Browse the teams you belong to."}
            <Box pt={"20px"}>
              <Button onClick={() => setModalOpen(true)}>
                CREATE NEW TEAM
              </Button>
            </Box>
          </>
        }
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Teams" }]}
      />
      <Box px={"30px"} pb={"10px"}>
        <TeamsList />
      </Box>
      <CreateNewTeamModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </PageContainer>
  );
}
