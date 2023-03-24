import { useState } from "react";
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

  const [showUsagePlanDetails, setShowUsagePlanDetails] = useState(false);

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

  const productKeyCount = !!usagePlans
    ? relevantUsagePlans.reduce(
        (acc, usagePlan) => usagePlan.apiIds.length + acc,
        0
      )
    : undefined;

  const toggleUsagePlanDetails = () => {
    setShowUsagePlanDetails((showing) => !showing);
  };

  /* eslint-disable no-console */
  console.log(api);
  /* eslint-enable no-console */
  return (
    <div className="apiUsagePlanCard">
      <div className="content">
        <div className="apiHeader" onClick={toggleUsagePlanDetails}>
          <div className="leadIconHolder">
            <Icon.Bug />
          </div>
          <div className="apiDetails">
            <div>
              <h4 className="title">{api.title}</h4>
              <div className="description">{api.description}</div>
            </div>
          </div>
          <div className="metaDetails">
            {productKeyCount !== undefined && (
              <div className="metaDetail">
                <div className="metaDetailIcon">
                  <Icon.Key />
                </div>
                <span className="countNumber">{productKeyCount}</span> API
                Product Key
                {productKeyCount === 1 ? "" : "s"}
              </div>
            )}
            <div className="metaDetail">
              <div className="metaDetailIcon">
                <Icon.Speedometer />
              </div>
              <span className="countNumber">{api.usagePlans.length}</span> Plan
              {api.usagePlans.length === 1 ? "" : "s"}
            </div>
          </div>
          <div className="viewToggleArrowHolder">
            {showUsagePlanDetails ? <Icon.UpArrow /> : <Icon.DownArrow />}
          </div>
        </div>
      </div>

      <div
        className={`usagePlansList ${
          showUsagePlanDetails ? "showing" : "hidden"
        }`}
      >
        {isLoading ? (
          <Loading
            message={`Getting information on usage plans for ${api.title}...`}
          />
        ) : (
          <div className="usagePlansListContent">
            {relevantUsagePlans.map((plan) => (
              <ErrorBoundary
                key={plan.name}
                fallback={`There was an issue loading information about ${plan.name}`}
              >
                <UsagePlanDetails apiId={api.apiId} usagePlan={plan} />
              </ErrorBoundary>
            ))}
          </div>
        )}
      </div>

      <div className="apiFooter">
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
