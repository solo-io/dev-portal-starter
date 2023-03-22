import { useListUsagePlans } from "../../../Apis/hooks";
import { Loading } from "../../Common/Loading";
import { UsagePlanCard } from "./UsagePlanCard";

/**
 * MAIN COMPONENT
 **/
export function UsagePlansList() {
  const { isLoading, data: usagePlansList } = useListUsagePlans();

  if (isLoading) {
    return <Loading message="Getting list of plans..." />;
  }

  // No filtering to do here, but let's make sure the ordering
  //   stays consistent.
  const displayedPlansList = usagePlansList
    ? usagePlansList.sort((planA, planB) =>
        planA.name.localeCompare(planB.name)
      )
    : [];

  return displayedPlansList.map((plan) => (
    <UsagePlanCard plan={plan} key={plan.name} />
  ));
}
