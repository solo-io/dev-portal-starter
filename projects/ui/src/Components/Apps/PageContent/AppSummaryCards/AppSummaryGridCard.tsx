import { Box } from "@mantine/core";
import { useMemo } from "react";
import { Icon } from "../../../../Assets/Icons";
import { CardStyles } from "../../../../Styles/shared/Card.style";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { getAppDetailsLink } from "../../../../Utility/link-builders";
import { AppWithTeam } from "../AppsList";

/**
 * MAIN COMPONENT
 **/
export function AppSummaryGridCard({ app }: { app: AppWithTeam }) {
  // In the future banner images may come through API data.
  //   Even when that is the case, a default image may be desired
  //   for when no image is available.
  // Further, you may have some clever trick for setting one of
  //   many default images.
  const defaultCardImage = useMemo(
    () => {
      return "https://img.huffingtonpost.com/asset/57f2730f170000f70aac9059.jpeg?ops=scalefit_960_noupscale";
    },
    // Currently we don't need to change images unless the api itself has changed.
    //   Depending on the function within the memo, this may not always be the case.
    [app.id]
  );

  return (
    <GridCardStyles.GridCardWithLink to={getAppDetailsLink(app)}>
      <GridCardStyles.ApiImageHolder>
        <img src={defaultCardImage} alt="placeholder" />
      </GridCardStyles.ApiImageHolder>
      <Box px={"20px"}>
        <CardStyles.TitleLarge>{app.name}</CardStyles.TitleLarge>
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
