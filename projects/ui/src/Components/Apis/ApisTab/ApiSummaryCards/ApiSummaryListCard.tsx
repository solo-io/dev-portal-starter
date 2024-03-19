import { Box } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { ApiProductSummary } from "../../../../Apis/api-types";
import { Icon } from "../../../../Assets/Icons";
import { ListCardStyles } from "../../../../Styles/shared/ListCard.style";
import { getApiProductDetailsSpecTabLink } from "../../../../Utility/link-builders";

/**
 * MAIN COMPONENT
 **/
export function ApiSummaryListCard({
  apiProduct,
}: {
  apiProduct: ApiProductSummary;
}) {
  return (
    <NavLink to={getApiProductDetailsSpecTabLink(apiProduct.id)}>
      <ListCardStyles.ListCardWithLink>
        <div className="content">
          <div className="majorIconHolder">
            <Icon.WrenchGear className="colorIt" />
          </div>
          <div className="details">
            <div>
              <h4 className="title">{apiProduct.name}</h4>
              <Box pl={"10px"}>API Versions: {apiProduct.versionsCount}</Box>
              {apiProduct.description && (
                <div className="description">{apiProduct.description}</div>
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
      </ListCardStyles.ListCardWithLink>
    </NavLink>
  );
}
