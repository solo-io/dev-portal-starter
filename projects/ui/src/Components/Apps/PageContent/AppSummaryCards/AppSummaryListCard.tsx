import { Box, Flex } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { Icon } from "../../../../Assets/Icons";
import { CardStyles } from "../../../../Styles/shared/Card.style";
import { ListCardStyles } from "../../../../Styles/shared/ListCard.style";
import { getAppDetailsLink } from "../../../../Utility/link-builders";
import { AppWithTeam } from "../AppsList";

/**
 * MAIN COMPONENT
 **/
export function AppSummaryListCard({ app }: { app: AppWithTeam }) {
  return (
    <NavLink to={getAppDetailsLink(app)}>
      <ListCardStyles.ListCardWithLink>
        <Flex>
          <ListCardStyles.MajorIconHolder>
            <Icon.WrenchGear />
          </ListCardStyles.MajorIconHolder>
          <Box p={"30px"}>
            <CardStyles.TitleLarge>{app.name}</CardStyles.TitleLarge>
            <CardStyles.Description>{app.description}</CardStyles.Description>
          </Box>
        </Flex>
        <ListCardStyles.Footer>
          <CardStyles.MetaInfo>
            <Icon.TeamsIcon />
            <CardStyles.SecondaryInfo>{app.team.name}</CardStyles.SecondaryInfo>
          </CardStyles.MetaInfo>
        </ListCardStyles.Footer>
      </ListCardStyles.ListCardWithLink>
    </NavLink>
  );
}
