import { Box } from "@mantine/core";
import { useMemo } from "react";
import { Subscription } from "../../Apis/api-types";
import {
  useListAppsForTeams,
  useListSubscriptionsForApps,
  useListTeams,
} from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../Common/PageContainer";
import SubscriptionsList from "../Common/SubscriptionsList/SubscriptionsList";

const AdminSubscriptionsPage = () => {
  // We can only administrate the subscriptions list for the apps
  // that this admin is a team of.

  // So we get the teams first...
  const { isLoading: isLoadingTeams, data: teams } = useListTeams();

  // Then the apps for those teams (these are the apps we can access)...
  const { isLoading: isLoadingApps, data: appsForTeams } = useListAppsForTeams(
    teams ?? []
  );

  // Then the subscriptions for those apps...
  const { isLoading: isLoadingSubscriptions, data: subscriptionsForApps } =
    useListSubscriptionsForApps(appsForTeams?.flat() ?? []);

  const isLoading = isLoadingTeams || isLoadingApps || isLoadingSubscriptions;

  // Then we can combine the subscriptions.
  const subscriptions = useMemo<Subscription[]>(() => {
    if (!subscriptionsForApps?.length) {
      return [];
    }
    const newSubscriptions =
      (
        subscriptionsForApps?.filter((s) =>
          Array.isArray(s)
        ) as Subscription[][]
      ).flat() ?? [];
    return newSubscriptions;
  }, [subscriptionsForApps]);

  //
  // Render
  //
  return (
    <PageContainer>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={"Subscriptions"}
            logo={<Icon.SuccessCheckmark />}
          />
        }
        description={
          "Review and take action on pending API Product subscriptions."
        }
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "Subscriptions" },
        ]}
      />
      <Box px={"30px"}>
        <SubscriptionsList
          subscriptions={subscriptions}
          isLoadingSubscriptions={isLoading}
        />
      </Box>
    </PageContainer>
  );
};

export default AdminSubscriptionsPage;
