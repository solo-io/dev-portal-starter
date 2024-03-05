import { NavLink } from "react-router-dom";
import { App } from "../../../../Apis/api-types";
import { Icon } from "../../../../Assets/Icons";
import { ListCardStyles } from "../../../../Styles/shared/ListCard.style";
import { getAppDetailsLink } from "../../../../Utility/link-builders";

/**
 * MAIN COMPONENT
 **/
export function AppSummaryListCard({ app }: { app: App }) {
  return (
    <NavLink to={getAppDetailsLink(app)}>
      <ListCardStyles.ListCardWithLink>
        <div className="content">
          <div className="majorIconHolder">
            <Icon.WrenchGear className="colorIt" />
          </div>
          <div className="details">
            <div>
              <h4 className="title">{app.name}</h4>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="metaInfo">
            <Icon.TeamsIcon />
            {/* 
            // TODO: Add in team info from listTeams()
            */}
            Team: {app.teamId}
          </div>
        </div>
      </ListCardStyles.ListCardWithLink>
    </NavLink>
  );
}
