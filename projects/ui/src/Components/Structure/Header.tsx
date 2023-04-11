import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../../Assets/logo.svg";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { LoggedInUser } from "./LoggedInUser";

/**
 * MAIN COMPONENT
 **/
export function Header() {
  const routerLocation = useLocation();

  const [inAPIsArea, setInAPIsArea] = useState(
    routerLocation.pathname.includes("/api") ||
      routerLocation.pathname.includes("/api-details/")
  );

  useEffect(() => {
    setInAPIsArea(
      routerLocation.pathname.includes("/apis/") ||
        routerLocation.pathname.includes("/api-details/")
    );
  }, [routerLocation.pathname]);

  return (
    <>
      <header aria-label="Site top level menus" className="topNav">
        <nav className="navContent">
          <a href="/" aria-hidden="true">
            <Logo />
          </a>
          <div className="siteNavigating">
            <NavLink to={"/"} end>
              Home
            </NavLink>
            <NavLink to={"/apis"} className={inAPIsArea ? "active" : ""}>
              APIs
            </NavLink>
            <div className="divider" />
            <div className="userLoginArea">
              <ErrorBoundary fallback="Access issues" class="horizontalError">
                <LoggedInUser />
              </ErrorBoundary>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
