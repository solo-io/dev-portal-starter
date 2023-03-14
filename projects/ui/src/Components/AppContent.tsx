import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import AppContentRoutes from "./AppContentRoutes";
import { Header } from "./Structure/Header";
import { useLocation } from "react-router-dom";

function AppContent() {
  const routeLocation = useLocation();
  const appCtx = useContext(AppContext);
  const { isMobileView, isDarkMode } = appCtx;

  const letContentGetWider = routeLocation.pathname.includes("/api-details/");

  return (
    <div
      data-theme={isDarkMode ? "dark" : "light"}
      className={`AppContainer ${isMobileView ? "is-mobile" : "is-desktop"} ${
        letContentGetWider ? "widerContent" : ""
      }`}
    >
      <Header />
      <AppContentRoutes />
    </div>
  );
}

export default AppContent;
