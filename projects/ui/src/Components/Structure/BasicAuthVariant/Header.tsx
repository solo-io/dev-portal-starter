import { Box, Popover } from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "../../../Assets/Icons";
import { ReactComponent as Logo } from "../../../Assets/logo.svg";
import { AppContext } from "../../../Context/AppContext";
import { AuthContext } from "../../../Context/AuthContext";
import { colors } from "../../../Styles";
import {
  CustomPage,
  customPages,
  logoImageURL,
} from "../../../user_variables.tmplr";
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

const useInArea = (paths: string[]) => {
  const routerLocation = useLocation();
  return useMemo(() => {
    return paths.some((s) => {
      return (
        routerLocation.pathname.includes(s) ||
        routerLocation.pathname.includes(getCustomPagePath(s))
      );
    });
  }, [routerLocation.pathname, paths]);
};

/**
 * MAIN COMPONENT
 **/
export function Header() {
  const { isAdmin } = useContext(AuthContext);
  const { isLoggedIn } = useContext(AuthContext);

  const inAdminTeamsArea = useInArea(["/admin/teams"]);
  const inAdminSubscriptionsArea = useInArea(["/admin/subscriptions"]);
  const inAPIsArea = useInArea(["/apis", "/api-details/"]);
  const inAppsArea = useInArea(["/apps", "/app-details/"]);
  const inTeamsArea = useInArea(["/teams", "/team-details/"]);

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

          <CustomPagesNavSection />

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

const CustomPagesNavSection = () => {
  const [opened, setOpened] = useState(false);
  const inAnyCustomPageArea = useInArea(
    customPages?.map((page) => page.path) ?? []
  );

  if (!customPages.length) {
    return null;
  }
  return (
    <Box
      sx={{
        height: "100%",
        marginRight: "15px",
        // TODO: The navbar uses classes: should refactor this into a style file.
        borderBottom: inAnyCustomPageArea ? "4px solid " + colors.lakeBlue : "",
      }}
    >
      <Popover position="bottom" opened={opened} onChange={setOpened}>
        <Popover.Target>
          <button
            className="userLoginArea loggedIn"
            onClick={() => setOpened(!opened)}
          >
            <div
              className="userHolder"
              style={
                inAnyCustomPageArea
                  ? // TODO: The navbar uses classes: should refactor this into a style file.
                    { color: colors.lakeBlue, marginTop: "0px" }
                  : {}
              }
            >
              Navigation
              <Icon.DownArrow
                className={`dropdownArrow canRotate ${opened ? "rotate180" : ""}`}
              />
            </div>
          </button>
        </Popover.Target>
        <StyledUserDropdown>
          {customPages.map((page) => (
            <CustomPageNavLink
              key={page.path}
              page={page}
              onClick={() => setOpened(false)}
            />
          ))}
        </StyledUserDropdown>
      </Popover>
    </Box>
  );
};

const CustomPageNavLink = ({
  page,
  onClick,
}: {
  page: CustomPage;
  onClick: () => void;
}) => {
  const onThisPage = useInArea([page.path]);
  return (
    <NavLink
      onClick={onClick}
      to={getCustomPagePath(page)}
      className={`navLink ${onThisPage ? "active" : ""}`}
    >
      {page.title}
    </NavLink>
  );
};
