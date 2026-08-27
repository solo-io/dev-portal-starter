import { Box } from "@mantine/core";
import { useState } from "react";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { useIsAdmin } from "../../Context/AuthContext";
import { PageContainer } from "../Common/PageContainer";
import CreateNewAppModal from "./Modals/CreateNewAppModal";
import { AppsPageContent } from "./PageContent/AppsPageContent";

export function AppsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  // See the note in TeamsPage: the app list is scoped to the caller's
  // effective mode rather than to the URL, so the wording follows the mode.
  const isAdmin = useIsAdmin();

  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Apps"} logo={<Icon.AppIcon />} />}
        description={
          <>
            {isAdmin
              ? "Browse all Apps in this portal."
              : "Browse the Apps of the teams you belong to."}
            <Box pt={"20px"}>
              <Button onClick={() => setModalOpen(true)}>CREATE NEW APP</Button>
            </Box>
          </>
        }
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Apps" }]}
      />
      <Box px={"30px"} pb={"10px"}>
        <AppsPageContent />
      </Box>
      <CreateNewAppModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PageContainer>
  );
}
