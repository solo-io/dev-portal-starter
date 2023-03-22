import { useListApiKeys } from "../../../Apis/hooks";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { Loading } from "../../Common/Loading";
import { ApiKeyCard } from "./ApiKeyCard";

/**
 * MAIN COMPONENT
 **/
export function APIKeysList({
  usagePlan,
  apiId,
}: {
  usagePlan: UsagePlan;
  apiId: string;
}) {
  const { isLoading, data: plansKeysList } = useListApiKeys(
    [apiId],
    [usagePlan.name]
  );

  if (isLoading) {
    return <Loading message="Getting list of api keys..." />;
  }

  // This should only ever be the plan we provided, but this is safer and should
  //   only be doing a find across n=1 || n=0.
  const planKeys = plansKeysList?.find(
    (planKey) => planKey.usagePlan === planName
  );
  // Next we're keeping the order of the key display consistent.
  const displayedApiKeys = !!planKeys?.apiKeys
    ? planKeys.apiKeys.sort((apiKeyA, apiKeyB) =>
        apiKeyA.apiId
          .toLocaleLowerCase()
          .localeCompare(apiKeyB.apiId.toLocaleLowerCase())
      )
    : [];

  return displayedApiKeys.map((apiKey) => (
    <ErrorBoundary
      fallback={`There was an issue while working with ${apiKey.apiId}`}
    >
      <ApiKeyCard key={apiKey.apiId} apiKey={apiKey} />
    </ErrorBoundary>
  ));
}
