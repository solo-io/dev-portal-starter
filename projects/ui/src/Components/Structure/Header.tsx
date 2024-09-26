import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { ReactComponent as Logo } from "../../Assets/logo.svg";
import { AppContext } from "../../Context/AppContext";
import { useIsAdmin, useIsLoggedIn } from "../../Context/AuthContext";
import {
  appliedOidcAuthCodeConfig,
  logoImageURL,
} from "../../user_variables.tmplr";
import { useInArea } from "../../Utility/utility";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { BasicAuthHeaderSection } from "./BasicAuth/BasicAuthHeaderSection";
import CustomPagesNavSection from "./CustomPagesNavSection";
import { HeaderStyles } from "./Header.style";
import { OidcAuthCodeHeaderSection } from "./OidcAuthCodeHeader/OidcAuthCodeHeaderSection";

const Header = () => {
  const { pageContentIsWide, portalServerType } = useContext(AppContext);
  const isAdmin = useIsAdmin();
  const isLoggedIn = useIsLoggedIn();

  const inAdminTeamsArea = useInArea(["/admin/teams"]);
  const inAdminAppsArea = useInArea(["/admin/apps"]);
  const inAdminSubscriptionsArea = useInArea(["/admin/subscriptions"]);
  const inAPIsArea = useInArea(["/apis", "/api-details/"]);
  const inAppsArea = useInArea(["/apps", "/app-details/"]);
  const inTeamsArea = useInArea(["/teams", "/team-details/"]);

  return (
    <HeaderStyles.StyledTopNavHeader aria-label="Site top level menus">
      <HeaderStyles.StyledTopNavContent pageContentIsWide={pageContentIsWide}>
        <div className="logoContainer">
          <Link aria-label="Home" to="/">
            {!!logoImageURL ? (
              <HeaderStyles.StyledLogoImg src={logoImageURL} alt="logo" />
            ) : (
              <Logo />
            )}
          </Link>
        </div>
        <div className="siteNavigating">
          <NavLink to={"/"} className={"navLink"} end>
            Home
          </NavLink>

          {portalServerType === "gloo-mesh-gateway" ? (
            //
            // region [GMG]
            // This is the same view if logged in or logged out.
            //
            <NavLink
              to={"/apis"}
              className={`navLink ${inAPIsArea ? "active" : ""}`}
            >
              APIs
            </NavLink>
          ) : (
            (portalServerType === "gloo-gateway" ||
              portalServerType === "unknown") && (
              <>
                {!isLoggedIn ? (
                  //
                  // region [GG] Logged-out
                  //
                  <NavLink
                    to={"/apis"}
                    className={`navLink ${inAPIsArea ? "active" : ""}`}
                  >
                    APIs
                  </NavLink>
                ) : isAdmin ? (
                  //
                  // region [GG] Logged-in, admin
                  //
                  <>
                    <NavLink
                      to={"/admin/teams"}
                      className={`navLink ${inAdminTeamsArea ? "active" : ""}`}
                    >
                      Teams
                    </NavLink>
                    <NavLink
                      to={"/admin/apps"}
                      className={`navLink ${inAdminAppsArea ? "active" : ""}`}
                    >
                      Apps
                    </NavLink>
                    <NavLink
                      to={"/admin/subscriptions"}
                      className={`navLink ${inAdminSubscriptionsArea ? "active" : ""}`}
                    >
                      Subscriptions
                    </NavLink>
                  </>
                ) : (
                  //
                  // region [GG] Logged-in, non-admin
                  //
                  <>
                    {/*
                    // If we allow admins to access the APIs page, things get a bit
                    // more confusing, since we will have to consider the behavior
                    // of the API details pages and pending subscriptions tabs.
                    // For example, a user can create an App from the API details page,
                    // so it would be strange for the admin not to have access to
                    // the Apps page in that case.
                    */}
                    <NavLink
                      to={"/apis"}
                      className={`navLink ${inAPIsArea ? "active" : ""}`}
                    >
                      APIs
                    </NavLink>
                    <NavLink
                      to={"/teams"}
                      className={`navLink ${inTeamsArea ? "active" : ""}`}
                    >
                      Teams
                    </NavLink>
                    <NavLink
                      to={"/apps"}
                      className={`navLink ${inAppsArea ? "active" : ""}`}
                    >
                      Apps
                    </NavLink>
                  </>
                )}
                {/*
                // region [GG] Custom Pages
                */}
                <CustomPagesNavSection />
              </>
            )
          )}

          <div className="divider" />

          {/*
          // region Auth Dropdown
          */}
          <ErrorBoundary fallback="Access issues" class="horizontalError">
            {!!appliedOidcAuthCodeConfig ? (
              <OidcAuthCodeHeaderSection />
            ) : (
              <BasicAuthHeaderSection />
            )}
          </ErrorBoundary>
        </div>
      </HeaderStyles.StyledTopNavContent>
    </HeaderStyles.StyledTopNavHeader>
  );
};

export default Header;
