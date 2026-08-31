import { Box, Tooltip } from "@mantine/core";
import { NavLink, useLocation } from "react-router";
import { CardStyles } from "../../../../Styles/shared/Card.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";

export const SubscriptionInfoCardLink = <T extends { name: string }>({
  itemTypeCapitalized,
  link,
  ItemIcon,
  item,
}: {
  itemTypeCapitalized: string;
  link: string;
  ItemIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  item: undefined | null | T;
}) => {
  const location = useLocation();
  const onLinkedPage = location.pathname === link;

  return (
    <Tooltip label={itemTypeCapitalized} position="right">
      <Box w="fit-content" sx={{ userSelect: "none" }}>
        {!!item && !onLinkedPage ? (
          <UtilityStyles.LinkContainer>
            <NavLink to={link}>
              <Box pt={"3px"} pos="absolute">
                <ItemIcon width={20} />
              </Box>
              <Box pl={"30px"} display={"inline-block"}>
                <CardStyles.SmallerText>{item.name}</CardStyles.SmallerText>
              </Box>
            </NavLink>
          </UtilityStyles.LinkContainer>
        ) : (
          <>
            <Box pt={"3px"} pos="absolute">
              <ItemIcon width={20} />
            </Box>
            <Box pl={"30px"} display={"inline-block"}>
              <CardStyles.SmallerText>
                {item?.name ?? itemTypeCapitalized + " Not Found"}
              </CardStyles.SmallerText>
            </Box>
          </>
        )}
      </Box>
    </Tooltip>
  );
};
