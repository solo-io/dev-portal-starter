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

/*** Mobile breakpoint width in pixels. */
const mobileWidth = 700;
const checkIsMobileView = () => window.innerWidth < mobileWidth;

export const AppContext = createContext({} as IAppContext);

export const AppContextProvider = (props: AppProviderProps) => {
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
