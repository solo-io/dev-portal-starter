import { Box } from "@mantine/core";
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
        <div className="content">
          <div className="majorIconHolder">
            <Icon.WrenchGear className="colorIt" />
          </div>
          <Box p={"30px"}>
            <CardStyles.TitleLarge>{app.name}</CardStyles.TitleLarge>
            <CardStyles.Description>{app.description}</CardStyles.Description>
          </Box>
        </div>
        <div className="footer">
          <div className="metaInfo">
            <Icon.TeamsIcon />
            <div className="typeTitle">{app.team.name}</div>
          </div>
        </div>
      </ListCardStyles.ListCardWithLink>
    </NavLink>
  );
}
