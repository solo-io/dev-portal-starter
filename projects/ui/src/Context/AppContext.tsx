import { createContext, useEffect, useState } from "react";

//
// Types
//
interface AppProviderProps {
  children?: any;
}
interface IAppContext extends AppProviderProps {
  isMobileView: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

//
// Context
//
export const AppContext = createContext({} as IAppContext);

/*** Mobile breakpoint width in pixels. */
const mobileWidth = 700;
const checkIsMobileView = () => window.innerWidth < mobileWidth;

//
// Provider
//
export const AppContextProvider = (props: AppProviderProps) => {
  //
  // Mobile View
  //
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

  //
  // Theme
  //
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("dark-mode") === "true"
  );
  useEffect(() => {
    localStorage.setItem("dark-mode", isDarkMode ? "true" : "false");
  }, [isDarkMode]);

  return (
    <AppContext.Provider
      value={{
        isMobileView,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
