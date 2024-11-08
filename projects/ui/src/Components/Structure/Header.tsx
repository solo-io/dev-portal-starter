import { useContext, useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../../Assets/logo.svg";
import { AppContext } from "../../Context/AppContext";
import { AuthContext } from "../../Context/AuthContext";
import {apiPageReload, logoImageURL} from "../../user_variables.tmplr";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { HeaderStyles } from "./Header.style";
import HeaderSectionLoggedIn from "./HeaderSectionLoggedIn";
import HeaderSectionLoggedOut from "./HeaderSectionLoggedOut";

if (!window.isSecureContext) {
  // eslint-disable-next-line no-console
  console.error(
    "This page is not being delivered in a secure context (see https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts), " +
      "so login will not work."
  );
}

/**
 * MAIN COMPONENT
 **/
export function Header() {
  const routerLocation = useLocation();
  const { isLoggedIn } = useContext(AuthContext);

  const inArea = (paths: string[]) => {
    return paths.some((s) => routerLocation.pathname.includes(s));
  };

  // Note: Removing sections for GGv2 demo.

  // const inAdminTeamsArea = useMemo(
  //   () => inArea(["/admin/teams"]),
  //   [routerLocation.pathname]
  // );

  // const inAdminSubscriptionsArea = useMemo(
  //   () => inArea(["/admin/subscriptions"]),
  //   [routerLocation.pathname]
  // );

  const inAPIsArea = useMemo(
    () => inArea(["/apis", "/api-details/"]),
    [routerLocation.pathname]
  );

  // Note: Removing sections for GGv2 demo.

  // const inAppsArea = useMemo(
  //   () => inArea(["/apps", "/app-details/"]),
  //   [routerLocation.pathname]
  // );

  // const inTeamsArea = useMemo(
  //   () => inArea(["/teams", "/team-details/"]),
  //   [routerLocation.pathname]
  // );

  const { pageContentIsWide } = useContext(AppContext);

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

          {/*
          // Note: Removing sections for GGv2 demo.

          {!isAdmin && (
            // If we allow admins to access the APIs page, things get a bit
            // more confusing, since we will have to consider the behavior
            // of the API details pages and pending subscriptions tabs.
            // For example, a user can create an App from the API details page,
            // so it would be strange for the admin not to have access to
            // the Apps page in that case.
          */}
          <NavLink
            to={"/apis"}
            // if apiPageReload is true use the onclick to reload the page
            onClick={apiPageReload === "true" ? () => (window.location.href = "/apis") : undefined}
            className={`navLink ${inAPIsArea ? "active" : ""}`}
          >
            APIs
          </NavLink>
          {/* )} */}

          {/* 

          // Note: Removing sections for GGv2 demo.

          {isLoggedIn &&
            (isAdmin ? (
              //
              // Logged-in, admin view
              //
              <>
                <NavLink
                  to={"/admin/teams"}
                  className={`navLink ${inAdminTeamsArea ? "active" : ""}`}
                >
                  Teams
                </NavLink>
                <NavLink
                  to={"/admin/subscriptions"}
                  className={`navLink ${
                    inAdminSubscriptionsArea ? "active" : ""
                  }`}
                >
                  Subscriptions
                </NavLink>
              </>
            ) : (
              //
              // Logged-in, non-admin view
              //
              <>
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
            ))}
            */}

          <div className="divider" />
          <ErrorBoundary fallback="Access issues" class="horizontalError">
            {isLoggedIn ? (
              <HeaderSectionLoggedIn />
            ) : (
              <HeaderSectionLoggedOut />
            )}
          </ErrorBoundary>
        </div>
      </HeaderStyles.StyledTopNavContent>
    </HeaderStyles.StyledTopNavHeader>
  );
}
