import { Box } from "@mantine/core";
import { ApiProductSummary } from "../../../../../Apis/api-types";
import { GridCardStyles } from "../../../../../Styles/shared/GridCard.style";
import { useGetImageURL } from "../../../../../Utility/custom-image-utility";
import { getApiProductDetailsSpecTabLink } from "../../../../../Utility/link-builders";
import { filterMetadataToDisplay } from "../../../../../Utility/utility";
import {
  DataPairPill,
  DataPairPillList,
} from "../../../../Common/DataPairPill";

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
        <img src={bgImageURL} alt="API thumbnail" />
      </GridCardStyles.ApiImageHolder>
      <Box pb={"25px"}>
        <GridCardStyles.Title>{apiProduct.name}</GridCardStyles.Title>
        API Versions: {apiProduct.versionsCount}
        {!!apiProduct.description && (
          <Box pt={"15px"}>
            <GridCardStyles.Description>
              {apiProduct.description}
            </GridCardStyles.Description>
          </Box>
        )}
        {!!apiProduct.apiProductMetadata && (
          <Box px={"5px"} pt={"15px"}>
            <DataPairPillList className="metadataList">
              {Object.entries(apiProduct.apiProductMetadata)
                .filter(filterMetadataToDisplay)
                .map(([pairKey, pairValue], idx) => (
                  <DataPairPill key={idx} pairKey={pairKey} value={pairValue} />
                ))}
            </DataPairPillList>
          </Box>
        )}
      </Box>
      {/* <GridCardStyles.Footer>
        <CardStyles.MetaInfo>
          <Icon.SmallCodeGear />
          <CardStyles.SecondaryInfo>OpenAPI</CardStyles.SecondaryInfo>
        </CardStyles.MetaInfo>
      </GridCardStyles.Footer> */}
    </GridCardStyles.GridCardWithLink>
  );
}
