import { UsagePlanCard } from "./UsagePlanCard";

export function UsagePlansList(usagePlansList: { usagePlansList: any[] }) {
  return (
    <div>
      {usagePlansList.map((plan) => (
        <UsagePlanCard />
      ))}
    </div>
  );
}
