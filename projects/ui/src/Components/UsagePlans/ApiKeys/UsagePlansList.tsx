import { UsagePlanCard } from "./UsagePlanCard";

/**
 * MAIN COMPONENT
 **/
export function UsagePlansList(usagePlansList: { usagePlansList: any[] }) {
  return (
    <div>
      {usagePlansList.map((plan) => (
        <UsagePlanCard />
      ))}
    </div>
  );
}
