import { useListApiKeys } from "../../../Apis/hooks";
import { Icon } from "../../../Assets/Icons";
import { Button } from "../../Common/Button";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { Loading } from "../../Common/Loading";
import { ApiKeyCard } from "./ApiKeyCard";

/**
 * MAIN COMPONENT
 **/
export function APIKeysList({
  usagePlan,
  apiId,
  openCreateKeyModal,
}: {
  usagePlan: UsagePlan;
  apiId: string;
  openCreateKeyModal: () => void;
}) {
  const {
    isLoading,
    data: plansKeysList,
    refetch: refetchPlanKeysList,
  } = useListApiKeys([usagePlan.name]);

  if (isLoading) {
    return <Loading message="Getting list of api keys..." />;
  }

  // This should only ever be the plan we provided, but this is safer and should
  //   only be doing a find across n=1 || n=0.
  const planKeys = plansKeysList?.find(
    (planKey) => planKey.usagePlan === usagePlan.name
  );
  // Next we're keeping the order of the key display consistent.
  const displayedApiKeys = !!planKeys?.apiKeys
    ? planKeys.apiKeys.sort((apiKeyA, apiKeyB) =>
        apiKeyA.apiId
          .toLocaleLowerCase()
          .localeCompare(apiKeyB.apiId.toLocaleLowerCase())
      )
    : [];

  return !!displayedApiKeys.length ? (
    displayedApiKeys.map((apiKey) => (
      <ErrorBoundary
        fallback={`There was an issue while working with ${apiKey.apiId}`}
      >
        <ApiKeyCard
          key={apiKey.apiId}
          apiKey={apiKey}
          usagePlanName={usagePlan.name}
          forceListRefetch={refetchPlanKeysList}
        />
      </ErrorBoundary>
    ))
  ) : (
    <div className="apiKeyCard emptyListCard">
      <div className="accessIcon">
        <Icon.CircledKey />
      </div>
      <div>
        <div className="title">There are no keys to display here.</div>
        <div className="description">
          Please{" "}
          <Button className="justText" onClick={openCreateKeyModal}>
            generate a key
          </Button>{" "}
          to access this API Product using this usage plan.
        </div>
      </div>
    </div>
  );
}
