import { ReactNode, createContext, useState } from "react";
import { useEventListener } from "../Utility/utility";

//
// Types
//
interface AppUtilsProviderProps {
  children?: ReactNode;
}
interface IAppUtilsContext extends AppUtilsProviderProps {
  windowInnerWidth: number;
  windowInnerHeight: number;
}

//
// Context
//
export const AppUtilsContext = createContext({} as IAppUtilsContext);

//
// Provider
//
export const AppUtilsContextProvider = (props: AppUtilsProviderProps) => {
  const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
  const [windowInnerHeight, setWindowInnerHeight] = useState(
    window.innerHeight
  );
  useEventListener(window, "resize", () => {
    setWindowInnerWidth(window.innerWidth);
    setWindowInnerHeight(window.innerHeight);
  });

  return (
    <AppUtilsContext.Provider value={{ windowInnerWidth, windowInnerHeight }}>
      {props.children}
    </AppUtilsContext.Provider>
  );
};
