import { NavLink } from "react-router-dom";
import { API } from "../../Apis/api-types";
import { Icon } from "../../Assets/Icons";
import { DataPairPill } from "../Common/DataPairPill";

/**
 * MAIN COMPONENT
 **/
export function ApiSummaryListCard({ api }: { api: API }) {
  return (
    <NavLink to={`/api-details/${api.apiId}`}>
      <div className="apiListCard">
        <div className="content">
          <div className="majorIconHolder">
            <Icon.WrenchGear className="colorIt" />
          </div>
          <div className="details">
            <div>
              <h4 className="title">{api.title}</h4>
              <div className="description">{api.description}</div>
              {api.customMetadata && (
                <div className="metadataList dataPairPillList">
                  {Object.entries(api.customMetadata).map(
                    ([pairKey, pairValue], idx) => (
                      <DataPairPill
                        key={idx}
                        pairKey={pairKey}
                        value={pairValue}
                      />
                    )
                  )}
                </div>
              )}
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
