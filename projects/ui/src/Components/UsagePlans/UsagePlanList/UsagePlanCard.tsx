import { UsagePlan } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { ApiKeysList } from "../ApiKeys/ApiKeysList";

/**
 * MAIN COMPONENT
 **/
export function UsagePlanCard({ plan }: { plan: UsagePlan }) {
  /* eslint-disable no-console */
  console.log(plan);
  /* eslint-enable no-console */
  return (
    <div className="apiListCard">
      <div className="content">
        <div className="majorIconHolder">
          <Icon.Bug />
        </div>
        <div className="details">
          <div>
            <h4 className="title">{plan.name}</h4>
            <div className="description">
              {plan.apiIds.map((apiId) => apiId + ",")}
            </div>
          </div>
        </div>
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
            <b>{plan.apiIds.length}</b> API Product Key
            {plan.apiIds.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>
      <div>
        <div>
          PLAN NAME{" "}
          <div>
            ( {plan.rateLimitPolicy.requestsPerUnit} per{" "}
            {plan.rateLimitPolicy.unit} )
          </div>
        </div>
      </div>

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
