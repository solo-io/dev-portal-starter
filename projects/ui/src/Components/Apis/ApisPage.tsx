import { Box, Tabs } from "@mantine/core";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../Common/PageContainer";
import { ApisPageStyles } from "./ApisPage.style";
import { ApisTabContent } from "./ApisTab/ApisTabContent";
import PendingSubscriptionTabContent from "./PendingSubscriptionsTab/PendingSubscriptionTabContent";

export function ApisPage() {
  return (
    <PageContainer>
      <BannerHeading
        title={<BannerHeadingTitle text={"APIs"} logo={<Icon.CodeGear />} />}
        description={
          "Browse the list of APIs and documentation in this portal. From here you can get the information you need to make API calls."
        }
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "APIs" }]}
      />

      <Box px={30} mb={60}>
        <Tabs defaultValue="apis">
          <ApisPageStyles.TabTitle>
            <Tabs.List>
              <Tabs.Tab value="apis">APIs</Tabs.Tab>
              <Tabs.Tab value="subs">Pending API Subscriptions</Tabs.Tab>
            </Tabs.List>
          </ApisPageStyles.TabTitle>

          <Tabs.Panel value="apis" pt={"sm"}>
            <ApisTabContent />
          </Tabs.Panel>

          <Tabs.Panel value="subs" pt={"sm"}>
            <PendingSubscriptionTabContent />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </PageContainer>
  );
}
