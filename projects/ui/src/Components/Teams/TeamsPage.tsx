import { Box } from "@mantine/core";
import { useState } from "react";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { PageContainer } from "../Common/PageContainer";
import CreateNewTeamModal from "./Modals/CreateNewTeamModal";
import { TeamsList } from "./PageContent/TeamsList";

export function TeamsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Teams"} logo={<Icon.TeamsIcon />} />}
        description={
          <>
            Browse the list of teams in this portal.
            <Box pt={"20px"}>
              <Button onClick={() => setModalOpen(true)}>
                CREATE NEW TEAM
              </Button>
            </Box>
          </>
        }
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Teams" }]}
      />
      <TeamsList />
      <CreateNewTeamModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </PageContainer>
  );
}
