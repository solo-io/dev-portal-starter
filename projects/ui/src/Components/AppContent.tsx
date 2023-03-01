import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import AppContentRoutes from "./AppContentRoutes";
import { Header } from "./Structure/Header";
import Banner from "../Assets/banner.png";

function AppContent() {
  const appCtx = useContext(AppContext);
  const { isMobileView, isDarkMode, isGreenTheme } = appCtx;

  return (
    <div
      data-theme={isDarkMode ? "dark" : "light"}
      data-color={isGreenTheme ? "green" : "blue"}
      className={`AppContainer ${isMobileView ? "is-mobile" : "is-desktop"}`}
    >
      <img src={Banner} alt="" className="background" role="banner" />
      <Header />
      <AppContentRoutes />
    </div>
  );
}

export default AppContent;
