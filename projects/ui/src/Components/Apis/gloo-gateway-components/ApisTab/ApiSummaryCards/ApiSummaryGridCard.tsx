import { Box } from "@mantine/core";
import { ApiProductSummary } from "../../../../../Apis/api-types";
import { Icon } from "../../../../../Assets/Icons";
import { CardStyles } from "../../../../../Styles/shared/Card.style";
import { GridCardStyles } from "../../../../../Styles/shared/GridCard.style";
import { useGetImageURL } from "../../../../../Utility/custom-image-utility";
import { getApiProductDetailsSpecTabLink } from "../../../../../Utility/link-builders";

/**
 * MAIN COMPONENT
 **/
export function ApiSummaryGridCard({
  apiProduct,
}: {
  apiProduct: ApiProductSummary;
}) {
  const bgImageURL = useGetImageURL(apiProduct.apiProductMetadata, "tacos");
  return (
    <GridCardStyles.GridCardWithLink
      to={getApiProductDetailsSpecTabLink(apiProduct.id)}
    >
      <GridCardStyles.ApiImageHolder>
        <img src={bgImageURL} alt="API thumbnail" role="banner" />
      </GridCardStyles.ApiImageHolder>
      <Box pb={"25px"}>
        <GridCardStyles.Title>{apiProduct.name}</GridCardStyles.Title>
        API Versions: {apiProduct.versionsCount}
        {apiProduct.description && (
          <Box pt={"15px"}>
            <GridCardStyles.Description>
              {apiProduct.description}
            </GridCardStyles.Description>
          </Box>
        )}
      </Box>
      <GridCardStyles.Footer>
        <CardStyles.MetaInfo>
          <Icon.SmallCodeGear />
          <CardStyles.SecondaryInfo>OpenAPI</CardStyles.SecondaryInfo>
        </CardStyles.MetaInfo>
      </GridCardStyles.Footer>
    </GridCardStyles.GridCardWithLink>
  );
}
