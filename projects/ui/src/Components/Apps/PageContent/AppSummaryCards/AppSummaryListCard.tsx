import { Box } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { Icon } from "../../../../Assets/Icons";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
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
            <GridCardStyles.Title>{app.name}</GridCardStyles.Title>
            <GridCardStyles.Description>
              {app.description}
            </GridCardStyles.Description>
          </Box>
          {/* <div className="details">
            <Flex direction={"column"}>
              <GridCardStyles.Title>{app.name}</GridCardStyles.Title>
              <GridCardStyles.Description>
                {app.description}
              </GridCardStyles.Description>
            </Flex>
          </div> */}
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
