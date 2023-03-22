import { API } from "../../../Apis/api-types";
import { useListUsagePlans } from "../../../Apis/hooks";
import { Icon } from "../../../Assets/Icons";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { Loading } from "../../Common/Loading";
import { UsagePlanDetails } from "./UsagePlanDetails";

/**
 * MAIN COMPONENT
 **/
export function APIUsagePlanCard({ api }: { api: API }) {
  const { isLoading, data: usagePlans } = useListUsagePlans();

  // We can tell users information about the API without the plans,
  //  so we can load most of the component.

  // When we have the plans, let's pull the ones we need and sort for consistency.
  const relevantUsagePlans = !!usagePlans
    ? api.usagePlans
        .map(
          (apiPlanName) =>
            usagePlans.find((usagePlan) => usagePlan.name === apiPlanName)!
        )
        .sort((planA, planB) =>
          planA.name
            .toLocaleLowerCase()
            .localeCompare(planB.name.toLocaleLowerCase())
        )
    : [];

  /* eslint-disable no-console */
  console.log(api);
  /* eslint-enable no-console */
  return (
    <div className="apiListCard">
      <div className="content">
        <div className="majorIconHolder">
          <Icon.Bug />
        </div>
        <div className="details">
          <div>
            <h4 className="title">{api.title}</h4>
            <div className="description">{api.description}</div>
          </div>
        </div>
        {usagePlans !== undefined && (
          <div className="metaDetails">
            <div className="metaDetail">
              <div className="metaDetailIcon">
                <Icon.Key />
              </div>
              <b>{plan.apiIds.length}</b> API Product Key
              {plan.apiIds.length === 1 ? "" : "s"}
            </div>
            <div className="metaDetail">
              <div className="metaDetailIcon">
                <Icon.Speedometer />
              </div>
              <b>{api.usagePlans.length}</b> Plan
              {api.usagePlans.length === 1 ? "" : "s"}
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <Loading
          message={`Getting information on usage plans for ${api.title}...`}
        />
      ) : (
        relevantUsagePlans.map((plan) => (
          <ErrorBoundary
            fallback={`There was an issue loading information about ${plan.name}`}
          >
            <UsagePlanDetails apiId={api.apiId} usagePlan={plan} />
          </ErrorBoundary>
        ))
      )}

      <div className="footer">
        <div className="metaInfo">
          <Icon.SmallCodeGear />
          <div className="typeTitle" aria-label="API Type">
            OpenAPI
          </div>
        </div>
        <div className="typeIcon">
          <Icon.OpenApiIcon />
        </div>
      </div>
    </div>
  );
}
