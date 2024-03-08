import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Flex } from "@mantine/core";
import { useMemo, useState } from "react";
import { App, Subscription } from "../../../../Apis/api-types";
import { Icon } from "../../../../Assets/Icons";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import SubscriptionInfoCard from "../../../Apis/PendingSubscriptionsTab/SubscriptionInfoCard";
import { EmptyData } from "../../../Common/EmptyData";

const AddSubscriptionButtonContents = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    color: ${theme.lakeBlue};
    font-size: 0.8rem;
    gap: 10px;
  `
);

const AddSubscriptionButton = (props: typeof Button.defaultProps) => {
  return (
    <Button {...props} variant="subtle">
      <AddSubscriptionButtonContents>
        ADD SUBSCRIPTION
        <Icon.PlusIcon />
      </AddSubscriptionButtonContents>
    </Button>
  );
};

const AppSubscriptionsSection = ({
  app,
  subscriptions,
}: {
  app: App;
  subscriptions: Subscription[];
}) => {
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] =
    useState(false);

  const appSubscriptions = useMemo(() => {
    return subscriptions?.filter((s) => s.applicationId === app.id);
  }, [subscriptions, app]);

  return (
    <DetailsPageStyles.Section>
      <Flex justify={"space-between"}>
        <DetailsPageStyles.Title>API Subscriptions</DetailsPageStyles.Title>
        <AddSubscriptionButton
          onClick={() => setShowAddSubscriptionModal(true)}
        />
      </Flex>
      {subscriptions.length === 0 && <EmptyData topic={"Subscriptions"} />}
      <Flex wrap="wrap" gap={"20px"}>
        {appSubscriptions.map((s) => (
          <SubscriptionInfoCard subscription={s} />
        ))}
      </Flex>
    </DetailsPageStyles.Section>
  );
};

export default AppSubscriptionsSection;
