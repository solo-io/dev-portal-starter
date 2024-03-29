import { Box } from "@mantine/core";
import { SubscriptionStatus } from "../../Apis/api-types";
import { useListSubscriptionsForStatus } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../Common/PageContainer";
import SubscriptionsList from "../Common/SubscriptionsList/SubscriptionsList";

const AdminSubscriptionsPage = () => {
  const { isLoading: isLoadingSubscriptions, data: subscriptions } =
    useListSubscriptionsForStatus(SubscriptionStatus.PENDING);

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
          isLoadingSubscriptions={isLoadingSubscriptions}
        />
      </Box>
    </PageContainer>
  );
};

export default AdminSubscriptionsPage;
