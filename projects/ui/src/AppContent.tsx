import { useContext } from "react";
import AppContentRoutes from "./AppContentRoutes";
import Navbar from "./Common/Navbar";
import { AppContext } from "./Context/AppContext";

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
