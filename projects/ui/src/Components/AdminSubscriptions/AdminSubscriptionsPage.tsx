import { Box } from "@mantine/core";
import { useMemo, useState } from "react";
import { Subscription } from "../../Apis/api-types";
import {
  useListFlatAppsForTeams,
  useListSubscriptionsForApps,
  useListTeams,
} from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { FilterPair } from "../../Utility/filter-utility";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../Common/PageContainer";
import SubscriptionsList from "../Common/SubscriptionsList/SubscriptionsList";
import { AdminSubscriptionsFilter } from "./AdminSubscriptionsFilter";

const AdminSubscriptionsPage = () => {
  //
  // Get Subscriptions
  //

  // We can only administrate the subscriptions list for the apps that this admin is a team of.

  // So we get the teams first...
  const { isLoading: isLoadingTeams, data: teams } = useListTeams();

  // Then the apps for those teams (these are the apps we can access)...
  const { isLoading: isLoadingApps, data: flatAppsForTeams } =
    useListFlatAppsForTeams(teams ?? []);

  // Then the subscriptions for the apps...
  const { isLoading: isLoadingSubscriptions, data: subscriptionsForApps } =
    useListSubscriptionsForApps(flatAppsForTeams);

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
  // Filters
  //

  const [allFilters, setAllFilters] = useState<FilterPair[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");

  const filters = {
    allFilters,
    setAllFilters,
    nameFilter,
    setNameFilter,
  };

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
      <AdminSubscriptionsFilter filters={filters} teams={teams ?? []} />
      <Box px={"30px"}>
        <SubscriptionsList
          subscriptions={subscriptions}
          isLoadingSubscriptions={isLoading}
          filters={filters}
        />
      </Box>
    </PageContainer>
  );
};

export default AdminSubscriptionsPage;
