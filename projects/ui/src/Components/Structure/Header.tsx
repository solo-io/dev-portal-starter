import { useContext, useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../../Assets/logo.svg";
import { PortalAuthContext } from "../../Context/PortalAuthContext";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import HeaderSectionLoggedIn from "./HeaderSectionLoggedIn";
import HeaderSectionLoggedOut from "./HeaderSectionLoggedOut";

/**
 * MAIN COMPONENT
 **/
export function Header() {
  const routerLocation = useLocation();
  const { isLoggedIn } = useContext(PortalAuthContext);

  const inAPIsArea = useMemo(() => {
    return ["/apis", "/api-details/"].some((s) =>
      routerLocation.pathname.includes(s)
    );
  }, [routerLocation.pathname]);

  return (
    <>
      <header aria-label="Site top level menus" className="topNav">
        <nav className="navContent">
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
            <div className="divider" />
            <ErrorBoundary fallback="Access issues" class="horizontalError">
              {isLoggedIn ? (
                <HeaderSectionLoggedIn />
              ) : (
                <HeaderSectionLoggedOut />
              )}
            </ErrorBoundary>
          </div>
        </nav>
      </header>
    </>
  );
}
