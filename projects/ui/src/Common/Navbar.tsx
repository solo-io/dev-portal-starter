import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import Button from "./Button";

function Navbar() {
  const appCtx = useContext(AppContext);
  const { isDarkMode, setIsDarkMode, isGreenTheme, setIsGreenTheme } = appCtx;
  //
  // Render
  //
  return (
    <div className="sl-prose sl-py-2 sl-px-2 sl-flex sl-flex-wrap sl-justify-between sl-inverted sl-bg-canvas-100">
      <p style={{ marginBottom: "0px" }}>
        <a className="sl-mr-5" href="/">
          Logo/Landing
        </a>
        <a className="sl-mr-5" href="/apis">
          Apis
        </a>
        <a className="sl-mr-5" href="/api-details/my-api">
          My-Api-Details
        </a>
        <a href="/usage-plans">Usage-Plans</a>
      </p>
      <div className="float-right">
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
    </div>
  );
}

export default Navbar;
