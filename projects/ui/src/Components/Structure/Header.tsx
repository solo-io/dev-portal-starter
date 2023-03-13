import { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../../Assets/logo.svg";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "../../Assets/Icons";

export function Header() {
  const routerLocation = useLocation();
  //const appCtx = useContext(AppContext);

  const [inAPIsArea, setInAPIsArea] = useState(
    routerLocation.pathname.includes("/api") ||
      routerLocation.pathname.includes("/api-details/")
  );

  //const { isDarkMode, setIsDarkMode, isGreenTheme, setIsGreenTheme } = appCtx;

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
            </div>
          </div>
        </nav>
      </header>
      {/*<div className="float-right">
        <a href="/usage-plans">Usage-Plans</a>
        {isDarkMode ? (
          <Button onClick={() => setIsDarkMode(false)}>Light Mode</Button>
        ) : (
          <Button onClick={() => setIsDarkMode(true)}>Dark Mode</Button>
        )}
        {isGreenTheme ? (
          <Button onClick={() => setIsGreenTheme(false)}>Blue Theme</Button>
        ) : (
          <Button onClick={() => setIsGreenTheme(true)}>Green Theme</Button>
        )}
        </div>*/}
    </>
  );
}
