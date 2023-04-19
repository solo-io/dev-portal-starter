import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { PageContainer } from "../Common/PageContainer";
import { APIUsagePlansList } from "./UsagePlanList/APIUsagePlansList";

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
        description="View usage plans and manage API Keys for all your APIs."
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "API Usage Plans & Keys" },
        ]}
      />
      <main className="apiUsagePlansList">
        <ErrorBoundary fallback="There was an issue loading the list of Apis">
          <APIUsagePlansList />
        </ErrorBoundary>
      </main>
    </PageContainer>
  );
}
