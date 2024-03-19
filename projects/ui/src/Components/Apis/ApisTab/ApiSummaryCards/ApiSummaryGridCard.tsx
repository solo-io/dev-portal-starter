import { Box } from "@mantine/core";
import { useMemo } from "react";
import { ApiProductSummary } from "../../../../Apis/api-types";
import { Icon } from "../../../../Assets/Icons";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { getApiProductDetailsSpecTabLink } from "../../../../Utility/link-builders";

/**
 * MAIN COMPONENT
 **/
export function ApiSummaryGridCard({
  apiProduct,
}: {
  apiProduct: ApiProductSummary;
}) {
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
    [apiProduct.id]
  );

  return (
    <GridCardStyles.GridCardWithLink
      to={getApiProductDetailsSpecTabLink(apiProduct.id)}
    >
      <div className="content">
        <div className="apiImageHolder">
          <img src={defaultCardImage} alt="" role="banner" />
        </div>
        <div className="details">
          <div>
            <Box pb={"25px"}>
              <h4 className="title">{apiProduct.name}</h4>
              API Versions: {apiProduct.versionsCount}
              {apiProduct.description && (
                <Box pt={"15px"}>
                  <div className="description">{apiProduct.description}</div>
                </Box>
              )}
            </Box>
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
    </GridCardStyles.GridCardWithLink>
  );
}
