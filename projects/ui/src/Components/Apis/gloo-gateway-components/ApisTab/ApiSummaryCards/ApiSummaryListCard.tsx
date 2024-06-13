import { Box, Flex, Text } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { ApiProductSummary } from "../../../../../Apis/api-types";
import { Icon } from "../../../../../Assets/Icons";
import { CardStyles } from "../../../../../Styles/shared/Card.style";
import { ListCardStyles } from "../../../../../Styles/shared/ListCard.style";
import { getApiProductDetailsSpecTabLink } from "../../../../../Utility/link-builders";

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
        <Flex>
          <ListCardStyles.MajorIconHolder>
            <Icon.WrenchGear />
          </ListCardStyles.MajorIconHolder>
          <Box p={"30px"}>
            <CardStyles.TitleLarge>{apiProduct.name}</CardStyles.TitleLarge>
            <Box mb="5px">API Versions: {apiProduct.versionsCount}</Box>
            {apiProduct.description && (
              <Text color="gray.6">{apiProduct.description}</Text>
            )}
          </Box>
        </Flex>
        <ListCardStyles.Footer>
          <CardStyles.MetaInfo>
            <Icon.SmallCodeGear />
            <CardStyles.SecondaryInfo>OpenAPI</CardStyles.SecondaryInfo>
          </CardStyles.MetaInfo>
          <ListCardStyles.TypeIcon>
            <Icon.OpenApiIcon />
          </ListCardStyles.TypeIcon>
        </ListCardStyles.Footer>
      </ListCardStyles.ListCardWithLink>
    </NavLink>
  );
}
