import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { appliedOidcAuthCodeConfig } from "../user_variables.tmplr";
import AppContentRoutes from "./AppContentRoutes";
import { Header } from "./Structure/Header";
import OidcAuthCodeHeaderVariant from "./Structure/OidcAuthCodeHeaderVariant/OidcAuthCodeHeaderVariant";

function AppContent() {
  const routeLocation = useLocation();
  const appCtx = useContext(AppContext);
  const { isDarkMode } = appCtx;

  const letContentGetWider = routeLocation.pathname.includes("/api-details/");

  /** Explanation of the data/class wrappings below:
   *    darkMode is from context. See the wrapping in App.tsx
   *    widerContent is used to allow the API-Schema-viewing page to fill out more
   *       since it is often a packed view.
   */
  return (
    <div
      data-theme={isDarkMode ? "dark" : "light"}
      className={`AppContainer ${letContentGetWider ? "widerContent" : ""}`}
    >
      {!!appliedOidcAuthCodeConfig ? <OidcAuthCodeHeaderVariant /> : <Header />}
      <AppContentRoutes />
    </div>
  );
}

export default AppContent;
