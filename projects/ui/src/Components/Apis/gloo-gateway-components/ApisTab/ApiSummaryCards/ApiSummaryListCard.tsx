import { Box, Flex, Text } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { ApiProductSummary } from "../../../../../Apis/api-types";
import { CardStyles } from "../../../../../Styles/shared/Card.style";
import { ListCardStyles } from "../../../../../Styles/shared/ListCard.style";
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
export function ApiSummaryListCard({
  apiProduct,
}: {
  apiProduct: ApiProductSummary;
}) {
  const bgImageURL = useGetImageURL(apiProduct.apiProductMetadata, "tacos");
  return (
    <NavLink to={getApiProductDetailsSpecTabLink(apiProduct.id)}>
      <ListCardStyles.ListCardWithLink>
        <Flex>
          <ListCardStyles.ApiImageHolder>
            <img src={bgImageURL} alt="API thumbnail" />
          </ListCardStyles.ApiImageHolder>

          <Box p={"30px"}>
            <CardStyles.TitleLarge>{apiProduct.name}</CardStyles.TitleLarge>
            <Box mb="5px">API Versions: {apiProduct.versionsCount}</Box>
            {apiProduct.description && (
              <Text color="gray.6">{apiProduct.description}</Text>
            )}
            {!!apiProduct.apiProductMetadata && (
              <Box pt={"5px"}>
                <DataPairPillList className="metadataList">
                  {Object.entries(apiProduct.apiProductMetadata)
                    .filter(filterMetadataToDisplay)
                    .map(([pairKey, pairValue], idx) => (
                      <DataPairPill
                        key={idx}
                        pairKey={pairKey}
                        value={pairValue}
                      />
                    ))}
                </DataPairPillList>
              </Box>
            )}
          </Box>
        </Flex>
        {/* <ListCardStyles.Footer>
          <CardStyles.MetaInfo>
            <Icon.SmallCodeGear />
            <CardStyles.SecondaryInfo>OpenAPI</CardStyles.SecondaryInfo>
          </CardStyles.MetaInfo>
          <ListCardStyles.TypeIcon>
            <Icon.OpenApiIcon />
          </ListCardStyles.TypeIcon>
        </ListCardStyles.Footer> */}
      </ListCardStyles.ListCardWithLink>
    </NavLink>
  );
}
