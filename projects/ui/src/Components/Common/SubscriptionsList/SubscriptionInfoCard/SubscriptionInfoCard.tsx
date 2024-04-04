import { Flex } from "@mantine/core";
import { useContext, useMemo } from "react";
import { di } from "react-magnetic-di";
import { Subscription } from "../../../../Apis/api-types";
import {
  useListApiProducts,
  useListAppsForTeams,
  useListTeams,
} from "../../../../Apis/hooks";
import { Icon } from "../../../../Assets/Icons";
import { AuthContext } from "../../../../Context/AuthContext";
import { CardStyles } from "../../../../Styles/shared/Card.style";
import { FilterType } from "../../../../Utility/filter-utility";
import {
  getAppDetailsLink,
  getTeamDetailsLink,
} from "../../../../Utility/link-builders";
import {
  capitalize,
  omitErrorMessageResponse,
} from "../../../../Utility/utility";
import { AdminSubscriptionsFiltrationProp } from "../../../AdminSubscriptions/AdminSubscriptionsFilter";
import {
  GetSubscriptionState,
  SubscriptionState,
  subscriptionStateMap,
} from "../SubscriptionsUtility";
import { SubscriptionInfoCardStyles as Styles } from "./SubscriptionInfoCard.style";
import SubscriptionInfoCardAdminFooter from "./SubscriptionInfoCardAdminFooter";
import SubscriptionInfoCardFooter from "./SubscriptionInfoCardFooter";
import { SubscriptionInfoCardLink } from "./SubscriptionInfoCardLink";

const SubscriptionInfoCard = ({
  subscription,
  filters,
}: {
  subscription: Subscription;
  filters?: AdminSubscriptionsFiltrationProp;
}) => {
  di(useListTeams, useListAppsForTeams);
  const { isAdmin } = useContext(AuthContext);

  //
  // Get Team and App for Subscription
  //

  const { data: apiProductsList } = useListApiProducts();
  const { data: teams } = useListTeams();
  const { data: appsForTeams } = useListAppsForTeams(teams ?? []);
  const apps = useMemo(() => appsForTeams?.flat(), [appsForTeams]);

  const subscribedApiProduct = useMemo(() => {
    return apiProductsList?.find(
      (apiProduct) => apiProduct.id === subscription.apiProductId
    );
  }, [apiProductsList, subscription]);

  const appThatSubscribed = useMemo(() => {
    return omitErrorMessageResponse(
      apps?.find(
        (app) =>
          omitErrorMessageResponse(app)?.id === subscription.applicationId
      )
    );
  }, [apps, subscription]);

  const teamOfAppThatSubscribed = useMemo(() => {
    return teams?.find((team) => team.id === appThatSubscribed?.teamId);
  }, [teams, appThatSubscribed]);

  //
  // Get Subscription State
  //

  const subscriptionState = useMemo(
    () => GetSubscriptionState(subscription),
    [subscription]
  );
  const subscriptionStateInfo = subscriptionStateMap[subscriptionState];

  //
  // Filter
  //

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

        <SubscriptionInfoCardLink
          itemTypeCapitalized={"App"}
          link={appThatSubscribed ? getAppDetailsLink(appThatSubscribed) : ""}
          ItemIcon={Icon.AppIcon}
          item={appThatSubscribed}
        />
        <SubscriptionInfoCardLink
          itemTypeCapitalized={"Team"}
          link={
            teamOfAppThatSubscribed
              ? getTeamDetailsLink(teamOfAppThatSubscribed)
              : ""
          }
          ItemIcon={Icon.TeamsIcon}
          item={teamOfAppThatSubscribed}
        />
      </Styles.Content>

      {isAdmin ? (
        <SubscriptionInfoCardAdminFooter
          subscription={subscription}
          subscriptionState={subscriptionState}
        />
      ) : (
        subscribedApiProduct && (
          <SubscriptionInfoCardFooter
            subscribedApiProductId={subscribedApiProduct.id}
            subscription={subscription}
            subscriptionState={subscriptionState}
          />
        )
      )}
    </Styles.Card>
  );
};

export default SubscriptionInfoCard;
