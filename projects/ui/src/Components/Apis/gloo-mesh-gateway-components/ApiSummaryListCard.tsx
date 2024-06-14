import { NavLink } from "react-router-dom";
import { API } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
import { DataPairPill, DataPairPillList } from "../../Common/DataPairPill";

/**
 * MAIN COMPONENT
 **/
export function ApiSummaryListCard({ api }: { api: API }) {
  return (
    <NavLink to={`/apis/${api.apiId}`}>
      <div className="apiListCard">
        <div className="content">
          <div className="majorIconHolder">
            <Icon.WrenchGear className="colorIt" />
          </div>
          <div className="details">
            <div>
              <h4 className="title">{api.title}</h4>
              <div className="subtitle-list">
                {!!api.apiProductDisplayName && (
                  <div className="subtitle-item">
                    API Product: {api.apiProductDisplayName}{" "}
                  </div>
                )}
                {!!api.apiVersion && (
                  <div className="subtitle-item">
                    API Version: {api.apiVersion}{" "}
                  </div>
                )}
              </div>
              <div className="description">{api.description}</div>
              {api.customMetadata && (
                <DataPairPillList className="metadataList">
                  {Object.entries(api.customMetadata).map(
                    ([pairKey, pairValue], idx) => (
                      <DataPairPill
                        key={idx}
                        pairKey={pairKey}
                        value={pairValue}
                      />
                    )
                  )}
                </DataPairPillList>
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
