import { Box } from "@mantine/core";
import { useState } from "react";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { PageContainer } from "../Common/PageContainer";
import CreateNewAppModal from "./Modals/CreateNewAppModal";
import { AppsPageContent } from "./PageContent/AppsPageContent";

export function AppsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"Apps"} logo={<Icon.AppIcon />} />}
        description={
          <>
            Browse the list of Apps in this portal.
            <Box pt={"20px"}>
              <Button onClick={() => setModalOpen(true)}>CREATE NEW APP</Button>
            </Box>
          </>
        }
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Apps" }]}
      />
      <AppsPageContent />
      <CreateNewAppModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </PageContainer>
  );
}
