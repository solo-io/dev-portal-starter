import { useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../../Assets/logo.svg";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { LoggedInUser } from "./LoggedInUser";

/**
 * MAIN COMPONENT
 **/
export function Header() {
  const routerLocation = useLocation();

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
              <LoggedInUser />
            </ErrorBoundary>
          </div>
        </nav>
      </header>
    </>
  );
}
