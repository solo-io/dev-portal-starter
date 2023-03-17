import { RedocStandalone } from "redoc";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";

/**
 * MAIN COMPONENT
 **/
export function RedocDisplay({ url }: { url: string }) {
  const appCtx = useContext(AppContext);
  const { isMobileView } = appCtx;

  return (
    <div className="redocDisplayContainer">
      {url !== undefined && (
        <RedocStandalone
          spec={url}
          options={{ layout: isMobileView ? "stacked" : "three-panel" }}
        />
      )}
    </div>
  );
}
