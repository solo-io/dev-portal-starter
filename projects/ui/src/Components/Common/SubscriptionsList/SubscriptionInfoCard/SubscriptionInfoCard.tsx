import { Box, Flex } from "@mantine/core";
import { useContext, useMemo } from "react";
import { di } from "react-magnetic-di";
import { NavLink } from "react-router-dom";
import { Subscription } from "../../../../Apis/api-types";
import {
  useListApiProducts,
  useListAppsForTeams,
  useListTeams,
} from "../../../../Apis/hooks";
import { Icon } from "../../../../Assets/Icons";
import { PortalAuthContext } from "../../../../Context/PortalAuthContext";
import { CardStyles } from "../../../../Styles/shared/Card.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { FilterType } from "../../../../Utility/filter-utility";
import {
  getApiProductDetailsDocsTabLink,
  getApiProductDetailsSpecTabLink,
} from "../../../../Utility/link-builders";
import { capitalize } from "../../../../Utility/utility";
import { AdminSubscriptionsFiltrationProp } from "../../../AdminSubscriptions/AdminSubscriptionsFilter";
import {
  GetSubscriptionState,
  SubscriptionState,
  subscriptionStateMap,
} from "../SubscriptionsUtility";
import { SubscriptionInfoCardStyles as Styles } from "./SubscriptionInfoCard.style";
import SubscriptionInfoCardAdminFooter from "./SubscriptionInfoCardAdminFooter";

const SubscriptionInfoCard = ({
  subscription,
  filters,
}: {
  subscription: Subscription;
  filters?: AdminSubscriptionsFiltrationProp;
}) => {
  di(useListTeams, useListAppsForTeams);
  const { data: apiProductsList } = useListApiProducts();
  const { data: teams } = useListTeams();
  const { data: appsForTeams } = useListAppsForTeams(teams ?? []);
  const apps = useMemo(() => appsForTeams?.flat(), [appsForTeams]);

  const { isAdmin } = useContext(PortalAuthContext);

  const subscribedApiProduct = useMemo(() => {
    return apiProductsList?.find(
      (apiProduct) => apiProduct.id === subscription.apiProductId
    );
  }, [apiProductsList, subscription]);

  const appThatSubscribed = useMemo(() => {
    return apps?.find((app) => app.id === subscription.applicationId);
  }, [apps, subscription]);

  const teamOfAppThatSubscribed = useMemo(() => {
    return teams?.find((team) => team.id === appThatSubscribed?.teamId);
  }, [teams, appThatSubscribed]);

  const subscriptionState = useMemo(
    () => GetSubscriptionState(subscription),
    [subscription]
  );
  const subscriptionStateInfo = subscriptionStateMap[subscriptionState];

  // Doing filtering here makes it possible to filter by all fields,
  // since we have all the information.
  // (app name + team name + api product name).
  const isFiltered = useMemo(() => {
    if (
      !appThatSubscribed ||
      !teamOfAppThatSubscribed ||
      !subscribedApiProduct
    ) {
      // If the card information hasn't loaded yet, filter this card out.
      return true;
    }
    if (!filters) {
      // If there were no filters, don't filter this card out.
      return false;
    }
    const { nameFilter, allFilters } = filters;
    let passesNameFilter =
      !nameFilter ||
      appThatSubscribed.name
        .toLocaleLowerCase()
        .includes(nameFilter.toLocaleLowerCase()) ||
      subscribedApiProduct.name
        .toLocaleLowerCase()
        .includes(nameFilter.toLocaleLowerCase()) ||
      teamOfAppThatSubscribed.name
        .toLocaleLowerCase()
        .includes(nameFilter.toLocaleLowerCase());
    const subscriptionStateValue = capitalize(
      SubscriptionState[subscriptionState].toLowerCase()
    );
    const passesFilterList =
      !allFilters.length ||
      allFilters.every(
        (filter) =>
          (filter.type === FilterType.name &&
            (subscribedApiProduct.name
              .toLocaleLowerCase()
              .includes(filter.displayName.toLocaleLowerCase()) ||
              appThatSubscribed.name
                .toLocaleLowerCase()
                .includes(filter.displayName.toLocaleLowerCase()) ||
              teamOfAppThatSubscribed.name
                .toLocaleLowerCase()
                .includes(filter.displayName.toLocaleLowerCase()))) ||
          (filter.type === FilterType.team &&
            filter.value === teamOfAppThatSubscribed.id) ||
          (filter.type === FilterType.subscriptionStatus &&
            filter.value === subscriptionStateValue)
      );
    // Filter this card out if it doesn't pass the name filter
    // or if it doesn't pass the filter list.
    return !passesNameFilter || !passesFilterList;
  }, [
    filters,
    subscriptionState,
    subscribedApiProduct,
    appThatSubscribed,
    teamOfAppThatSubscribed,
  ]);

  //
  // Render
  //
  if (isFiltered) {
    return null;
  }
  return (
    <Styles.Card subscriptionState={subscriptionState}>
      <Styles.Content>
        <Flex justify="space-between">
          <CardStyles.TitleMedium bold>
            {subscribedApiProduct?.name ?? "API Product Not Found"}
          </CardStyles.TitleMedium>
          <Styles.SubscriptionCardBadge subscriptionState={subscriptionState}>
            {subscriptionStateInfo.label}
          </Styles.SubscriptionCardBadge>
        </Flex>
        <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
          <Icon.AppIcon width={20} />
          <CardStyles.SmallerText>
            {appThatSubscribed?.name ?? "App Not Found"}
          </CardStyles.SmallerText>
        </Flex>
        <Flex align={"center"} justify={"flex-start"} gap={"8px"}>
          <Icon.TeamsIcon width={20} />
          <CardStyles.SmallerText>
            {teamOfAppThatSubscribed?.name ?? "Team Not Found"}
          </CardStyles.SmallerText>
        </Flex>
      </Styles.Content>
      {isAdmin ? (
        <SubscriptionInfoCardAdminFooter
          subscription={subscription}
          subscriptionState={subscriptionState}
        />
      ) : (
        subscribedApiProduct && (
          <Styles.Footer>
            <UtilityStyles.NavLinkContainer>
              <NavLink
                to={getApiProductDetailsSpecTabLink(subscribedApiProduct.id)}
              >
                SPEC
              </NavLink>
            </UtilityStyles.NavLinkContainer>
            <Box>|</Box>
            <UtilityStyles.NavLinkContainer>
              <NavLink
                to={getApiProductDetailsDocsTabLink(subscribedApiProduct.id)}
              >
                DOCS
              </NavLink>
            </UtilityStyles.NavLinkContainer>
          </Styles.Footer>
        )
      )}
    </Styles.Card>
  );
};

export default SubscriptionInfoCard;
