import { MouseEventHandler, useContext } from "react";
import { Link, NavLink } from "react-router";
import { ReactComponent as Logo } from "../../Assets/logo.svg?react";
import { AppContext } from "../../Context/AppContext";
import { useIsAdmin, useIsLoggedIn } from "../../Context/AuthContext";
import {
  apiPageReload,
  appliedOidcAuthCodeConfig,
  logoImageURL,
} from "../../user_variables.tmplr";
import { useInArea } from "../../Utility/utility";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { BasicAuthHeaderSection } from "./BasicAuth/BasicAuthHeaderSection";
import CustomPagesNavSection from "./CustomPagesNavSection";
import { HeaderStyles } from "./Header.style";
import { OidcAuthCodeHeaderSection } from "./OidcAuthCodeHeader/OidcAuthCodeHeaderSection";

// This checks if we need to do a full page load when going to the /apis page,
// which is sometimes necessary for getting external auth routing to work.
export const useOnApisPageClick = () => {
  const { portalServerType } = useContext(AppContext);
  const isLoggedIn = useIsLoggedIn();

  // In these cases, we can return `undefined` so that the app does normal react-router routing.
  if (
    // If using gloo-gateway and logged in, we should be able to use normal react-router routing.
    // This is because the auth is already done.
    (portalServerType === "gloo-gateway" && isLoggedIn) ||
    apiPageReload !== "true"
  ) {
    return { onApisPageClick: undefined };
  }

  // Otherwise, we want to override the react-router behavior here with `e.preventDefault`.
  // If we don't we get 2 `/apis` page history entries when doing a full page load.
  const onClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    window.location.href = "/apis";
  };
  return { onApisPageClick: onClick };
};

const ApisPageNavLink = () => {
  const { onApisPageClick } = useOnApisPageClick();
  const inAPIsArea = useInArea(["/apis", "/api-details/"]);
  return (
    <NavLink
      to={"/apis"}
      onClick={onApisPageClick}
      className={`navLink ${inAPIsArea ? "active" : ""}`}
    >
      APIs
    </NavLink>
  );
};

const Header = () => {
  const { pageContentIsWide, portalServerType } = useContext(AppContext);
  const isAdmin = useIsAdmin();
  const isLoggedIn = useIsLoggedIn();

  const inAdminTeamsArea = useInArea(["/admin/teams"]);
  const inAdminAppsArea = useInArea(["/admin/apps"]);
  const inAdminSubscriptionsArea = useInArea(["/admin/subscriptions"]);
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
            <ApisPageNavLink />
          ) : (
            (portalServerType === "gloo-gateway" ||
              portalServerType === "unknown") && (
              <>
                {!isLoggedIn ? (
                  //
                  // region [GG] Logged-out
                  //
                  <ApisPageNavLink />
                ) : isAdmin ? (
                  //
                  // region [GG] Logged-in, admin
                  //
                  <>
                    {/*
                    // Admins get the APIs catalog too. The portal server treats
                    // an admin as a superset of a regular user, so the catalog,
                    // API Product details and the flows reachable from them all
                    // work for admins.
                    */}
                    <ApisPageNavLink />
                    {/*
                    // Team and app details live at /teams/:id and /apps/:id for
                    // admins too, so the tab has to stay active for the plain
                    // area as well as the /admin one.
                    */}
                    <NavLink
                      to={"/admin/teams"}
                      className={`navLink ${
                        inAdminTeamsArea || inTeamsArea ? "active" : ""
                      }`}
                    >
                      Teams
                    </NavLink>
                    <NavLink
                      to={"/admin/apps"}
                      className={`navLink ${
                        inAdminAppsArea || inAppsArea ? "active" : ""
                      }`}
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
                    <ApisPageNavLink />
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
