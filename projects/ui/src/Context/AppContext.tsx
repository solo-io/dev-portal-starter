import { createContext, useEffect, useState } from "react";

//
// Types
//
interface AppProviderProps {
  children?: any;
}
interface IAppContext extends AppProviderProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

export const AppContext = createContext({} as IAppContext);

export const AppContextProvider = (props: AppProviderProps) => {
  //  There is no toggle on any pages to switch this currently.
  //  This skeleton is here to provide a sample for additions and
  //     hooks for those who do wish to add a dark mode to get started.
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("dark-mode") === "true"
  );
  useEffect(() => {
    localStorage.setItem("dark-mode", isDarkMode ? "true" : "false");
  }, [isDarkMode]);

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
