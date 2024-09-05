import { Box } from "@mantine/core";
import { Icon } from "../../../../Assets/Icons";
import { CardStyles } from "../../../../Styles/shared/Card.style";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { getAppDetailsLink } from "../../../../Utility/link-builders";
import { AppWithTeam } from "../AppsList";

/**
 * MAIN COMPONENT
 **/
export function AppSummaryGridCard({ app }: { app: AppWithTeam }) {
  return (
    <GridCardStyles.GridCardWithLink to={getAppDetailsLink(app)}>
      <Box px={"20px"} sx={{ textAlign: "left", marginTop: "10px" }}>
        <CardStyles.TitleMedium>{app.name}</CardStyles.TitleMedium>
        <CardStyles.Description>{app.description}</CardStyles.Description>
      </Box>
      <GridCardStyles.Footer>
        <CardStyles.MetaInfo>
          <Icon.TeamsIcon />
          <CardStyles.SecondaryInfo>{app.team.name}</CardStyles.SecondaryInfo>
        </CardStyles.MetaInfo>
      </GridCardStyles.Footer>
    </GridCardStyles.GridCardWithLink>
  );
}
