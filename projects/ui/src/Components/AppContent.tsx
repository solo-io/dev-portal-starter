import { useContext } from "react";
import Navbar from "../Common/Navbar";
import { AppContext } from "../Context/AppContext";
import AppContentRoutes from "./AppContentRoutes";

function AppContent() {
  const appCtx = useContext(AppContext);
  const { isMobileView, isDarkMode, isGreenTheme } = appCtx;

  return (
    <div
      className={`app ${isMobileView ? "is-mobile" : "is-desktop"}`}
      data-theme={isDarkMode ? "dark" : "light"}
      data-color={isGreenTheme ? "green" : "blue"}
    >
      <Navbar />
      <div className="background" />
      <AppContentRoutes />
    </div>
  );
}

export default AppContent;
