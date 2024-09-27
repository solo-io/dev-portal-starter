import { Box } from "@mantine/core";
import { useState } from "react";
import { Icon } from "../../Assets/Icons";
import { useIsAdmin } from "../../Context/AuthContext";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { PageContainer } from "../Common/PageContainer";
import CreateNewAppModal from "./Modals/CreateNewAppModal";
import { AppsPageContent } from "./PageContent/AppsPageContent";

export function AppsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const isAdmin = useIsAdmin();

  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Apps"} logo={<Icon.AppIcon />} />}
        description={
          <>
            Browse the list of Apps in this portal.
            {!isAdmin && (
              <Box pt={"20px"}>
                <Button onClick={() => setModalOpen(true)}>
                  CREATE NEW APP
                </Button>
              </Box>
            )}
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
