import PageContainer from "../Common/PageContainer";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Icon } from "../../Assets/Icons";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { UsagePlansList } from "./UsagePlanList/UsagePlansList";

/**
 * MAIN COMPONENT
 **/
export function UsagePlansPage() {
  return (
    <PageContainer>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={"API Usage Plans & Keys"}
            logo={<Icon.CodeGear />}
          />
        }
        description={
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam."
        }
      />
      <main className="plansList">
        <ErrorBoundary fallback="There was an issue loading the list of Plans">
          <UsagePlansList />
        </ErrorBoundary>
      </main>
    </PageContainer>
  );
}
