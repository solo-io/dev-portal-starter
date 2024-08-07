import { Box } from "@mantine/core";
import { Icon } from "../../../Assets/Icons";
import { apisImageURL } from "../../../user_variables.tmplr";
import { BannerHeading } from "../../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../../Common/PageContainer";
import { ApisTabContent } from "./ApisTab/ApisTabContent";

// const URL_SEARCH_PARAM_TAB_KEY = "tab";
// const tabValues = {
//   APIS: "apis",
//   SUBS: "subs",
// };
// const defaultTabValue = tabValues.APIS;

export function GG_ApisPage() {
  // di(useListApiProducts, useListSubscriptionsForStatus);
  // const { isLoading: isLoadingApiProducts } = useListApiProducts();

  // Note: Removing sections for GGv2 demo.

  // const {
  //   isLoading: isLoadingSubscriptions,
  //   data: subscriptions,
  //   error: subscriptionsErr,
  // } = useListSubscriptionsForStatus(SubscriptionStatus.PENDING);
  // const subscriptionsError =
  //   !!subscriptionsErr ||
  //   isSubscriptionsListError(subscriptions) ||
  //   !Array.isArray(subscriptions);
  // const isLoading = isLoadingApiProducts || isLoadingSubscriptions;
  // const isLoading = isLoadingApiProducts;

  //
  // Tab navigation
  //
  // const navigate = useNavigate();
  // const location = useLocation();
  // const [tab, setTab] = useState(
  //   new URLSearchParams(location.search).get(URL_SEARCH_PARAM_TAB_KEY) ??
  //     defaultTabValue
  // );
  // // Update the URL when the selected tab changes.
  // useEffect(() => {
  //   const newSearchParams = new URLSearchParams(location.search);
  //   if (!!tab) {
  //     newSearchParams.set(URL_SEARCH_PARAM_TAB_KEY, tab);
  //   }
  //   navigate(location.pathname + `?${newSearchParams.toString()}`, {
  //     replace: true,
  //   });
  // }, [tab, location.search]);

  //
  // Render
  //
  return (
    <PageContainer>
      <BannerHeading
        bgImageURL={apisImageURL}
        title={<BannerHeadingTitle text={"APIs"} logo={<Icon.CodeGear />} />}
        description={
          "Browse the list of APIs and documentation in this portal. From here you can get the information you need to make API calls."
        }
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "APIs" }]}
      />

      <Box px={30} mb={60}>
        {/* {isLoading ? (
          // Make sure the APIs are finished loading since they are a dependency of both tabs.
          <Loading message="Getting list of apis..." />
        ) : ( 
          ) : subscriptionsError ? (
          //   // If there was a subscriptions error message, don't show the subscriptions.
*/}
        <ApisTabContent />
        {/* <Tabs value={tab} onTabChange={(t) => setTab(t ?? defaultTabValue)}>
            {/*
          
            Tab Titles
            * /}
            <Tabs.List>
              <Tabs.Tab value={tabValues.APIS}>APIs</Tabs.Tab>
               <Tabs.Tab value={tabValues.SUBS}>
                <Flex align="center" justify="center" gap={10}>
                  <span>Pending API Subscriptions</span>
                  {isLoadingSubscriptions || !subscriptions ? (
                    <Box pl={5} mb={-10}>
                      <Loader size={"20px"} color={colors.seaBlue} />
                    </Box>
                  ) : (
                    subscriptions.length > 0 && (
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
            * /}
        <Tabs.Panel value={tabValues.APIS} pt={"xl"}>
          <ApisTabContent />
        </Tabs.Panel>
        {/* <Tabs.Panel value={tabValues.SUBS} pt={"xl"}>
              <PendingSubscriptionsTabContent
                subscriptions={subscriptions}
                isLoadingSubscriptions={isLoadingSubscriptions}
              /> 
            </Tabs.Panel>
            * /}
          </Tabs> 
        )}*/}
      </Box>
    </PageContainer>
  );
}
