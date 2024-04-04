import { Box } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import {
  getApiProductDetailsDocsTabLink,
  getApiProductDetailsSpecTabLink,
} from "../../../../Utility/link-builders";
import { SubscriptionInfoCardStyles } from "./SubscriptionInfoCard.style";

const SubscriptionInfoCardFooter = ({
  subscribedApiProductId,
}: {
  subscribedApiProductId: string;
}) => {
  return (
    <SubscriptionInfoCardStyles.Footer>
      <UtilityStyles.NavLinkContainer>
        <NavLink to={getApiProductDetailsSpecTabLink(subscribedApiProductId)}>
          SPEC
        </NavLink>
      </UtilityStyles.NavLinkContainer>
      <Box>|</Box>
      <UtilityStyles.NavLinkContainer>
        <NavLink to={getApiProductDetailsDocsTabLink(subscribedApiProductId)}>
          DOCS
        </NavLink>
      </UtilityStyles.NavLinkContainer>
    </SubscriptionInfoCardStyles.Footer>
  );
};

export default SubscriptionInfoCardFooter;
