import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useContext, useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../../Assets/logo.svg";
import { AppContext } from "../../Context/AppContext";
import { PortalAuthContext } from "../../Context/PortalAuthContext";
import { ContentWidthNav } from "../../Styles/ContentWidthHelpers";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import HeaderSectionLoggedIn from "./HeaderSectionLoggedIn";
import HeaderSectionLoggedOut from "./HeaderSectionLoggedOut";

export const StyledTopNavHeader = styled.header(
  ({ theme }) => css`
    grid-area: header;
    width: 100%;
    height: 90px;
    background: white;
    box-shadow: #253e580b 0px 2px 8px;

    // These are the hover/active styles for the links in the main top bar,
    // and links in the logged in user dropdown area.
    .userLoginArea.loggedIn,
    .logoContainer,
    .siteNavigating a.navLink,
    .userLoginArea .userHolder,
    a,
    button.logout {
      cursor: pointer;
      &:hover {
        color: ${theme.internalLinkColorDark10};
        background-color: ${theme.splashBlueLight10};
        border-color: ${theme.splashBlue};
      }
      &:active {
        color: ${theme.internalLinkColorDark10};
        background-color: ${theme.splashBlueLight7};
        border-color: ${theme.splashBlue};
      }

      // .active means that this is the page that the user is on.
      // This overrides the font color and border color so that it doesn't
      // get the same hover/active states.
      &.active,
      &.active:hover,
      &.active:active {
        color: ${theme.internalLinkColor};
        border-color: ${theme.internalLinkColor};
      }
    }
  `
);

export const StyledTopNavContent = styled(ContentWidthNav)(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    user-select: none;

    height: 100%;

    color: ${theme.defaultText};

    .logoContainer {
      display: flex;
      align-items: center;
      margin-left: -12px;
      padding: 0 12px;
      width: auto;
      height: 100%;
    }

    .siteNavigating {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      gap: 5px;

      a.navLink {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding: 0px 12px;
        cursor: pointer;

        color: ${theme.externalLinkColor};
        border-bottom: 4px solid white;
        transition: background-color 0.25s, border-bottom-color 0.25s,
          color 0.25s;
        &.active,
        &.active:hover,
        &.active:active {
          color: ${theme.internalLinkColor};
          border-bottom-color: ${theme.internalLinkColor};
        }
      }

      .divider {
        height: 33px;
        width: 1px;
        background: ${theme.splashBlue};
      }
    }

    .userLoginArea {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 12px;
      margin-right: -12px;

      .userHolder {
        display: flex;
        align-items: center;

        svg.userCircle {
          width: 40px;
          height: 40px;
          margin-right: 10px;

          * {
            fill: currentColor;
          }
        }

        svg.dropdownArrow {
          width: 14px;
          margin-left: 10px;
          * {
            stroke: currentColor;
            stroke-width: 2;
          }
        }
      }
    }
  `
);

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
  const { isLoggedIn } = useContext(PortalAuthContext);

  const inArea = (paths: string[]) => {
    return paths.some((s) => routerLocation.pathname.includes(s));
  };

  const inAPIsArea = useMemo(
    () => inArea(["/apis", "/api-details/"]),
    [routerLocation.pathname]
  );

  const inAppsArea = useMemo(
    () => inArea(["/apps", "/app-details/"]),
    [routerLocation.pathname]
  );

  const inTeamsArea = useMemo(
    () => inArea(["/teams", "/team-details/"]),
    [routerLocation.pathname]
  );

  const { pageContentIsWide } = useContext(AppContext);

  return (
    <>
      <StyledTopNavHeader aria-label="Site top level menus">
        <StyledTopNavContent pageContentIsWide={pageContentIsWide}>
          <div className="logoContainer">
            <Link to="/" aria-hidden="true">
              <Logo />
            </Link>
          </div>
          <div className="siteNavigating">
            <NavLink to={"/"} className={"navLink"} end>
              Home
            </NavLink>
            <NavLink
              to={"/apis"}
              className={`navLink ${inAPIsArea ? "active" : ""}`}
            >
              APIs
            </NavLink>
            {/* 

            // TODO: Check which routes here require auth. 
            */}
            <NavLink
              to={"/apps"}
              className={`navLink ${inAppsArea ? "active" : ""}`}
            >
              Apps
            </NavLink>
            <NavLink
              to={"/teams"}
              className={`navLink ${inTeamsArea ? "active" : ""}`}
            >
              Teams
            </NavLink>
            <div className="divider" />
            <ErrorBoundary fallback="Access issues" class="horizontalError">
              {isLoggedIn ? (
                <HeaderSectionLoggedIn />
              ) : (
                <HeaderSectionLoggedOut />
              )}
            </ErrorBoundary>
          </div>
        </StyledTopNavContent>
      </StyledTopNavHeader>
    </>
  );
}
