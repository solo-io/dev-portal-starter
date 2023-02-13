import { createContext, useEffect, useState } from "react";

//
// Types
//
interface AppProviderProps {
  children?: any;
}
interface IAppContext extends AppProviderProps {
  isMobileView: string;
  isDarkMode: boolean;
  isGreenTheme: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsGreenTheme: (isGreenTheme: boolean) => void;
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
  const [isGreenTheme, setIsGreenTheme] = useState(
    localStorage.getItem("green-theme") === "true"
  );
  useEffect(() => {
    localStorage.setItem("dark-mode", isDarkMode ? "true" : "false");
    localStorage.setItem("green-theme", isGreenTheme ? "true" : "false");
  }, [isDarkMode, isGreenTheme]);

  return (
    <AppContext.Provider
      value={{
        isMobileView,
        isDarkMode,
        setIsDarkMode,
        isGreenTheme,
        setIsGreenTheme,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
