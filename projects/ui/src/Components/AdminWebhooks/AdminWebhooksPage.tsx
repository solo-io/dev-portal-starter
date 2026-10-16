import { Box } from "@mantine/core";
import { useState } from "react";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { PageContainer } from "../Common/PageContainer";
import { WarningAlert } from "../Common/WarningAlert";
import WebhookEndpointFormModal from "./Modals/WebhookEndpointFormModal";
import { WebhookEndpointsTable } from "./WebhookEndpointsTable";

const AdminWebhooksPage = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <PageContainer>
      <BannerHeading
        title={
          <BannerHeadingTitle text={"Webhooks"} logo={<Icon.NetworkHub />} />
        }
        description={
          <>
            Notify external systems of portal events, such as a subscription
            being requested. Every enabled webhook receives every event. Test a
            webhook to check that its receiver is ready, and disable it to stop
            its events without deleting it.
            <Box pt={"20px"}>
              <Button onClick={() => setAddModalOpen(true)}>ADD WEBHOOK</Button>
            </Box>
          </>
        }
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "Webhooks" }]}
      />
      <Box px={"30px"} pb={"10px"}>
        {/*
        // Deliveries carry no signature. The only proof of origin is the
        // client certificate the operator can configure for https deliveries,
        // which this page cannot see, so the warning covers both cases.
        */}
        <Box mb={"30px"}>
          <WarningAlert>
            Webhook requests are not signed. A receiver can verify that a
            request came from this portal only by requiring the client
            certificate that the portal's operator configures for https
            deliveries. Otherwise, only use receivers reachable over a trusted
            network, and have them look up the subscription through the portal
            API before acting on an event.
          </WarningAlert>
        </Box>
        <WebhookEndpointsTable />
      </Box>
      <WebhookEndpointFormModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </PageContainer>
  );
};

export default AdminWebhooksPage;
