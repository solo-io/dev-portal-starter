import { useListApiKeys } from "../../../Apis/hooks";
import { Button } from "../../Common/Button";
import { Loading } from "../../Common/Loading";
import { ApiKeyCard } from "./ApiKeyCard";

/**
 * MAIN COMPONENT
 **/
export function APIKeysList({ planName }: { planName: string }) {
  const { isLoading, data: planKeysList } = useListApiKeys(undefined, [
    planName,
  ]);

  if (isLoading) {
    return <Loading message="Getting list of plans..." />;
  }

  // This should only ever be the plan we provided, but this is safer and should
  //   only be doing a find across n=1 || n=0.
  const planKeys = planKeysList?.find(
    (planKey) => planKey.usagePlan === planName
  );
  // Next we're keeping the order of the key display consistent.
  const displayedApiKeys = !!planKeys?.apiKeys
    ? planKeys.apiKeys.sort((apiKeyA, apiKeyB) =>
        apiKeyA.apiId.localeCompare(apiKeyB.apiId)
      )
    : [];

  return (
    <div>
      <div>
        HEADING <Button>+ ADD KEY</Button>
      </div>
      <div>
        {displayedApiKeys.map((apiKey) => (
          <ApiKeyCard key={apiKey.apiId} apiKey={apiKey} />
        ))}
      </div>
    </div>
  );
}
