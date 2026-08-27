import { Box } from "@mantine/core";
import { useState } from "react";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { useIsAdmin } from "../../Context/AuthContext";
import { PageContainer } from "../Common/PageContainer";
import CreateNewTeamModal from "./Modals/CreateNewTeamModal";
import { TeamsList } from "./TeamsList/TeamsList";

export function TeamsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  // The portal server scopes the team list to the caller's effective mode,
  // not to the URL: admins get every team on /teams as well as on
  // /admin/teams. So the wording follows the mode, not the route.
  const isAdmin = useIsAdmin();

  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Teams"} logo={<Icon.TeamsIcon />} />}
        description={
          <>
            {isAdmin
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
