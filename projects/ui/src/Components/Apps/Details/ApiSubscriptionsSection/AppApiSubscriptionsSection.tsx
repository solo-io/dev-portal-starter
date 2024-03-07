import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Flex } from "@mantine/core";
import { useMemo, useState } from "react";
import { App } from "../../../../Apis/api-types";
import { useListSubscriptions } from "../../../../Apis/hooks";
import { Icon } from "../../../../Assets/Icons";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";

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

const AppSubscriptionsSection = ({ app }: { app: App }) => {
  const { isLoading: isLoadingSubscriptions, data: subscriptions } =
    useListSubscriptions();

  const [showAddSubscriptionModal, setShowAddSubscriptionModal] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState<string>();
  const appSubscriptions = useMemo(() => {
    try {
      return subscriptions?.filter((s) => s.applicationId === app.id);
    } catch {
      const errMsg = (subscriptions as any).message;
      if (!!errMsg) {
        console.error(errMsg);
        setErrorMessage(errMsg);
      }
    }
  }, [subscriptions, app]);

  // if (!!errorMessage) {
  //   return null;
  // }
  return (
    <DetailsPageStyles.Section>
      <Flex justify={"space-between"}>
        <DetailsPageStyles.Title>API Subscriptions</DetailsPageStyles.Title>
        <AddSubscriptionButton
          onClick={() => setShowAddSubscriptionModal(true)}
        />
      </Flex>
      {/* {isLoadingSubscriptions || appSubscriptions === undefined ? (
        <Loading message="Loading Subscriptions" />
      ) : ( */}
      <>
        <Flex justify={"flex-end"}></Flex>
        <Flex wrap="wrap" gap={"20px"}>
          {/* {appSubscriptions.map((s) => (
            <SubscriptionInfoCard subscription={s} />
          ))} */}
        </Flex>
      </>
      {/* )} */}
    </DetailsPageStyles.Section>
  );
};

export default AppSubscriptionsSection;
