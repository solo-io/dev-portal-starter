import { NavLink } from "react-router-dom";
import { ApiProductSummary } from "../../../../Apis/api-types";
import { Icon } from "../../../../Assets/Icons";
import { ListCardStyles } from "../../../../Styles/shared/ListCard.style";
import { getApiDetailsLinkWithId } from "../../../../Utility/link-builders";

/**
 * MAIN COMPONENT
 **/
export function ApiSummaryListCard({
  apiProduct,
}: {
  apiProduct: ApiProductSummary;
}) {
  return (
    <NavLink to={getApiDetailsLinkWithId(apiProduct.id)}>
      <ListCardStyles.ListCardWithLink>
        <div className="content">
          <div className="majorIconHolder">
            <Icon.WrenchGear className="colorIt" />
          </div>
          <div className="details">
            <div>
              <h4 className="title">{apiProduct.name}</h4>
              {/* <div className="subtitle-list">
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
              </div> */}
              {/* <div className="description">{api.description}</div> */}
              {/* {api.apiVersions.map((apiVersion) => {
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
              })} */}
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
      </ListCardStyles.ListCardWithLink>
    </NavLink>
  );
}
