import { NavLink } from "react-router-dom";
import { API } from "../../Apis/api-types";
import { Icon } from "../../Assets/Icons";

export function ApiSummaryListCard({ key, api }: { key?: string; api: API }) {
  //
  // Render
  //
  return (
    <NavLink to={`/api-details/${api.apiId}`}>
      <div key={key} className="apiListCard">
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
    </NavLink>
  );
}
