import { Box, Flex, Loader, Tabs } from "@mantine/core";
import { di } from "react-magnetic-di";
import { useListApis } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { colors } from "../../Styles";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Loading } from "../Common/Loading";
import { PageContainer } from "../Common/PageContainer";
import { ApisPageStyles } from "./ApisPage.style";
import { ApisTabContent } from "./ApisTab/ApisTabContent";
import PendingSubscriptionTabContent from "./PendingSubscriptionsTab/PendingSubscriptionTabContent";

export enum SubscriptionState {
  PENDING,
  ACCEPTED,
  REJECTED,
}
export const subscriptionStateMap = {
  [SubscriptionState.PENDING]: {
    label: "PENDING",
    accentColor: colors.seaBlue,
    borderColor: colors.splashBlue,
  },
  [SubscriptionState.ACCEPTED]: {
    label: "ACCEPTED",
    accentColor: colors.midGreen,
    borderColor: colors.splashBlue,
  },
  [SubscriptionState.REJECTED]: {
    label: "REJECTED",
    accentColor: colors.darkRed,
    borderColor: colors.pumpkinOrange,
  },
};

// TODO: Replace with real data
const isLoadingSubscriptions = false;
const subscriptions = [
  {
    subscriptionName: "Tracks v1.0",
    appName: "App Name Lorem Ipsum",
    usagePlanName: "Gold Usage Plan",
    // Subscription is for the entire api product (not version-specific).
    apiProductId: "catstronauts-rest-api",
    state: SubscriptionState.PENDING,
  },
  {
    subscriptionName: "Tracks v1.1",
    appName: "App 2 Name",
    usagePlanName: "Gold Usage Plan",
    apiProductId: "catstronauts-rest-api",
    state: SubscriptionState.REJECTED,
  },
];
export type Subscription = (typeof subscriptions)[0];

export function ApisPage() {
  di(useListApis);
  const { isLoading } = useListApis();

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
        {isLoading ? (
          // Make sure the APIs are finished loading since they are a dependency of both tabs.
          <Loading message="Getting list of apis..." />
        ) : (
          <Tabs defaultValue="apis">
            {/*
          
            Tab Titles
            */}
            <Tabs.List>
              <Tabs.Tab value="apis">APIs</Tabs.Tab>
              <Tabs.Tab value="subs">
                <Flex align="center" justify="center" gap={10}>
                  <span>Pending API Subscriptions</span>
                  {isLoadingSubscriptions ? (
                    <Box pl={5} mb={-10}>
                      <Loader size={"20px"} color={colors.seaBlue} />
                    </Box>
                  ) : (
                    subscriptions.length && (
                      <ApisPageStyles.NumberInCircle>
                        {subscriptions.length}
                      </ApisPageStyles.NumberInCircle>
                    )
                  )}
                </Flex>
              </Tabs.Tab>
            </Tabs.List>
            {/*
          
            Tab Content
            */}
            <Tabs.Panel value="apis" pt={"xl"}>
              <ApisTabContent />
            </Tabs.Panel>
            <Tabs.Panel value="subs" pt={"xl"}>
              <PendingSubscriptionTabContent subscriptions={subscriptions} />
            </Tabs.Panel>
          </Tabs>
        )}
      </Box>
    </PageContainer>
  );
}