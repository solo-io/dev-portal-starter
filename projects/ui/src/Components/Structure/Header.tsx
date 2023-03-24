import { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../../Assets/logo.svg";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "../../Assets/Icons";

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
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/apis"} className={inAPIsArea ? "active" : ""}>
              APIs
            </NavLink>
            <div className="divider" />
            <div className="userLoginArea">
              <Icon.UserProfile className="userCircle" />
              <Icon.DownArrow className="dropdownArrow" />
              TODO:{" "}
              <NavLink to={"/usage-plans"}>DROPDOWN WITH USAGE PLANS</NavLink>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
