import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { customLog } from "../Utility/utility";

//
// Types
//
// Initial state: PortalServerType='unknown'
type PortalServerType = "gloo-gateway" | "gloo-mesh-gateway" | "unknown";
interface AppProviderProps {
  children?: any;
}
interface IAppContext extends AppProviderProps {
  isMobileView: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  preferGridView: boolean;
  setPreferGridView: (newValue: boolean) => void;
  pageContentIsWide: boolean;

  portalServerType: PortalServerType;
  updatePortalServerType(newType: PortalServerType): void;
}

/*** Mobile breakpoint width in pixels. */
const mobileWidth = 700;
const checkIsMobileView = () => window.innerWidth < mobileWidth;

export const AppContext = createContext({} as IAppContext);

export const AppContextProvider = (props: AppProviderProps) => {
  const routeLocation = useLocation();
  const [isMobileView, setIsMobileView] = useState(checkIsMobileView());
  useEffect(() => {
    const onWindowResize = () => {
      const nowIsMobile = checkIsMobileView();
      if (nowIsMobile !== isMobileView) setIsMobileView(nowIsMobile);
    };
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, [isMobileView]);

  //  There is no toggle on any pages to switch this currently.
  //  This skeleton is here to provide a sample for additions and
  //     hooks for those who wish to add a dark mode to get started.
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("dark-mode") === "true"
  );
  useEffect(() => {
    localStorage.setItem("dark-mode", isDarkMode ? "true" : "false");
  }, [isDarkMode]);

  const [preferGridView, setPreferGridView] = useState(
    localStorage.getItem("prefer-grid-view") !== "false"
  );
  useEffect(() => {
    localStorage.setItem("prefer-grid-view", preferGridView ? "true" : "false");
  }, [preferGridView]);

  // Portal Server Type
  const [portalServerType, setPortalServerType] = useState<PortalServerType>(
    (window as any)._gloo_portal_server_type ?? "unknown"
  );

  return (
    <AppContext.Provider
      value={{
        isMobileView,
        isDarkMode,
        setIsDarkMode,
        preferGridView,
        setPreferGridView,
        pageContentIsWide: routeLocation.pathname.includes("/apis/"),
        portalServerType,
        updatePortalServerType: (t) => {
          customLog("Updating portal server type: ", t);
          (window as any)._gloo_portal_server_type = t;
          setPortalServerType(t);
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
