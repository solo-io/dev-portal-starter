import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import Button from "../Common/Button";
import { ReactComponent as Logo } from "../../Assets/logo.svg";

export function Header() {
  const appCtx = useContext(AppContext);
  const { isDarkMode, setIsDarkMode, isGreenTheme, setIsGreenTheme } = appCtx;

  return (
    <>
      <header aria-label="Site top level menus" className="topNav">
        <nav className="navContent">
          <a href="/" aria-hidden="true">
            <Logo />
          </a>
          <div>
            <a href="/">Home</a>
            <a href="/apis">APIs</a>
            <a href="/apis">USER AREA</a>
          </div>
        </nav>
      </header>
      <div className="float-right">
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
      </div>
    </>
  );
}
