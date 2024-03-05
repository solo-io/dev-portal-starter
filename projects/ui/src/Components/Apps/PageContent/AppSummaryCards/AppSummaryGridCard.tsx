import { Box } from "@mantine/core";
import { useMemo } from "react";
import { Icon } from "../../../../Assets/Icons";
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
      <div className="content">
        <div className="apiImageHolder">
          <img src={defaultCardImage} alt="" role="banner" />
        </div>
        <Box px={"20px"}>
          <GridCardStyles.Title>{app.name}</GridCardStyles.Title>
          <GridCardStyles.Description>
            {app.description}
          </GridCardStyles.Description>
        </Box>
      </div>
      <div className="footer">
        <div className="metaInfo">
          <Icon.TeamsIcon />
          <div className="typeTitle">{app.team.name}</div>
        </div>
      </div>
    </GridCardStyles.GridCardWithLink>
  );
}
