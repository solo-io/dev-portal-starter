import { RedocStandalone } from "redoc";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";

export function RedocDisplay({ spec }: { spec: string }) {
  const appCtx = useContext(AppContext);
  const { isMobileView } = appCtx;

  return (
    <div className="redocDisplayContainer" aria-label="Schema Display">
      {url !== undefined && (
        <RedocStandalone
          spec={spec}
          options={{ layout: isMobileView ? "stacked" : "three-panel" }}
        />
      )}
    </div>
  );
}
