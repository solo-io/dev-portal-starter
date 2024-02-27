import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { APIProduct } from "../../Apis/api-types";
import { Icon } from "../../Assets/Icons";
import { DataPairPill, DataPairPillList } from "../Common/DataPairPill";
import { getApiDetailsLink } from "./helpers";

/**
 * MAIN COMPONENT
 **/
export function ApiSummaryGridCard({ api }: { api: APIProduct }) {
  // In the future banner images may come through API data.
  //   Even when that is the case, a default image may be desired
  //   for when no image is available.
  // Further, you may have some clever trick for setting one of
  //   many default images.
  const defaultCardImage = useMemo(
    () => {
      return "https://img.huffingtonpost.com/asset/57f2730f170000f70aac9059.jpeg?ops=scalefit_960_noupscale";
    },
    // Currently we don't need to change images unless the api itself has changed.
    //   Depending on the function within the memo, this may not always be the case.
    [api.apiProductId]
  );

  return (
    <NavLink to={getApiDetailsLink(api)} className="apiGridCard">
      <div className="content">
        <div className="apiImageHolder">
          <img src={defaultCardImage} alt="" role="banner" />
        </div>
        <div className="details">
          <div>
            <h4 className="title">{api.apiProductDisplayName}</h4>
            {/* <div className="subtitle-list">
              {!!api.apiVersion && (
                <div className="subtitle-item">
                  API Version: {api.apiVersion}{" "}
                </div>
              )}
            </div> */}
            {/* 
            // TODO: There may be a description in the new API.
            <div className="description">{api.description}</div> */}
            {api.apiVersions.map((apiVersion) => {
              if (!apiVersion.customMetadata) {
                return null;
              }
              return (
                <DataPairPillList
                  key={apiVersion.apiVersion}
                  className="metadataList"
                >
                  {Object.entries(apiVersion.customMetadata).map(
                    ([pairKey, pairValue], idx) => (
                      <DataPairPill
                        key={idx}
                        pairKey={pairKey}
                        value={pairValue}
                      />
                    )
                  )}
                </DataPairPillList>
              );
            })}
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
    </NavLink>
  );
}
