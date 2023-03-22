import { UsagePlan } from "../../../Apis/api-types";
import { useListApiKeys, useListApis } from "../../../Apis/hooks";
import { Button } from "../../Common/Button";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { Loading } from "../../Common/Loading";
import { APIKeysList } from "../ApiKeys/ApiKeysList";
import { APIUsagePlanCard } from "./APIUsagePlanCard";

/**
 * MAIN COMPONENT
 **/
export function UsagePlanDetails({
  usagePlan,
  apiId,
}: {
  usagePlan: UsagePlan;
  apiId: string;
}) {
  return (
    <div>
      <div>
        <div>
          <div>{usagePlan.name}</div>
          <div>
            ( {usagePlan.rateLimitPolicy.requestsPerUnit} per{" "}
            {usagePlan.rateLimitPolicy.unit} )
          </div>
        </div>

        <div>
          HEADING <Button>+ ADD KEY</Button>
        </div>
      </div>
      <APIKeysList apiId={apiId} usagePlan={usagePlan} />
    </div>
  );
}
