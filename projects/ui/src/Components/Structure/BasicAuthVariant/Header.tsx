import { Box, Popover } from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "../../../Assets/Icons";
import { ReactComponent as Logo } from "../../../Assets/logo.svg";
import { AppContext } from "../../../Context/AppContext";
import { AuthContext } from "../../../Context/AuthContext";
import { customPages, logoImageURL } from "../../../user_variables.tmplr";
import { getCustomPagePath } from "../../../Utility/utility";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { HeaderStyles } from "../Header.style";
import HeaderSectionLoggedIn, {
  StyledUserDropdown,
} from "./HeaderSectionLoggedIn";
import HeaderSectionLoggedOut from "./HeaderSectionLoggedOut";

if (!window.isSecureContext) {
  // eslint-disable-next-line no-console
  console.error(
    "This page is not being delivered in a secure context (see https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts), " +
      "so login will not work."
  );
}

const inArea = (
  paths: string[],
  routerLocation: ReturnType<typeof useLocation>
) => {
  return paths.some((s) => routerLocation.pathname.includes(s));
};

/**
 * MAIN COMPONENT
 **/
export function Header() {
  const { isAdmin } = useContext(AuthContext);
  const routerLocation = useLocation();
  const { isLoggedIn } = useContext(AuthContext);

  const inAdminTeamsArea = useMemo(
    () => inArea(["/admin/teams"], routerLocation),
    [routerLocation.pathname]
  );

  const inAdminSubscriptionsArea = useMemo(
    () => inArea(["/admin/subscriptions"], routerLocation),
    [routerLocation.pathname]
  );

  const inAPIsArea = useMemo(
    () => inArea(["/apis", "/api-details/"], routerLocation),
    [routerLocation.pathname]
  );

  const inAppsArea = useMemo(
    () => inArea(["/apps", "/app-details/"], routerLocation),
    [routerLocation.pathname]
  );

  const inTeamsArea = useMemo(
    () => inArea(["/teams", "/team-details/"], routerLocation),
    [routerLocation.pathname]
  );

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

          {!isLoggedIn ? (
            //
            // Logged-out view
            //
            <>
              <NavLink
                to={"/apis"}
                className={`navLink ${inAPIsArea ? "active" : ""}`}
              >
                APIs
              </NavLink>
            </>
          ) : isAdmin ? (
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

          <HeaderCustomPagesNav />

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

const HeaderCustomPagesNav = () => {
  const [opened, setOpened] = useState(false);
  const routerLocation = useLocation();

  if (!customPages.length) {
    return null;
  }
  return (
    <Box sx={{ height: "100%", marginRight: "15px" }}>
      <Popover position="bottom" opened={opened} onChange={setOpened}>
        <Popover.Target>
          <button
            className="userLoginArea loggedIn"
            onClick={() => setOpened(!opened)}
          >
            <div className="userHolder">
              Navigation
              <Icon.DownArrow
                className={`dropdownArrow canRotate ${opened ? "rotate180" : ""}`}
              />
            </div>
          </button>
        </Popover.Target>
        <StyledUserDropdown>
          {customPages.map((page) => (
            <NavLink
              onClick={() => setOpened(false)}
              key={page.path}
              to={getCustomPagePath(page)}
              className={`navLink ${inArea([page.path], routerLocation) ? "active" : ""}`}
            >
              {page.title}
            </NavLink>
          ))}
        </StyledUserDropdown>
      </Popover>
    </Box>
  );
};
