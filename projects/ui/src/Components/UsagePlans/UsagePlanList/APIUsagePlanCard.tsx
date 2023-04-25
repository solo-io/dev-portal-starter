import { useState } from "react";
import { di } from "react-magnetic-di";
import { API, UsagePlan } from "../../../Apis/api-types";
import { useListUsagePlans } from "../../../Apis/hooks";
import { Icon } from "../../../Assets/Icons";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { Loading } from "../../Common/Loading";
import { UsagePlanDetails } from "./UsagePlanDetails";

/**
 * MAIN COMPONENT
 **/
export function APIUsagePlanCard({ api }: { api: API }) {
  di(useListUsagePlans);
  const { isLoading, data: usagePlans } = useListUsagePlans();

  const [showUsagePlanDetails, setShowUsagePlanDetails] = useState(false);

  // We can tell users information about the API without the plans,
  //  so we can load most of the component.

  // When we have the plans, let's pull the ones we need and sort for consistency.
  const relevantUsagePlans = !!usagePlans
    ? (
        api.usagePlans
          .map((apiPlanName) =>
            usagePlans.find((usagePlan) => usagePlan.name === apiPlanName)
          )
          .filter((plan) => plan !== undefined) as UsagePlan[]
      ).sort((planA, planB) =>
        planA.name
          .toLocaleLowerCase()
          .localeCompare(planB.name.toLocaleLowerCase())
      )
    : [];

  // TODO: total key count is not returned. https://github.com/solo-io/gloo-mesh-enterprise/issues/8705
  const productKeyCount = undefined;

  const toggleUsagePlanDetails = () => {
    setShowUsagePlanDetails((showing) => !showing);
  };

  return (
    <div className="apiUsagePlanCard">
      <div className="content">
        <button className="apiHeader" onClick={toggleUsagePlanDetails}>
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
              <span className="countNumber">{relevantUsagePlans.length}</span>{" "}
              Plan
              {relevantUsagePlans.length === 1 ? "" : "s"}
            </div>
          </div>
          <div className="viewToggleArrowHolder">
            <Icon.DownArrow
              className={`canRotate ${showUsagePlanDetails ? "rotate180" : ""}`}
            />
          </div>
        </button>
      </div>

      {showUsagePlanDetails && (
        <div className={"usagePlansList"}>
          {isLoading ? (
            <Loading
              message={`Getting information on usage plans for ${api.title}...`}
            />
          ) : (
            relevantUsagePlans.length > 0 && (
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
            )
          )}
        </div>
      )}

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
