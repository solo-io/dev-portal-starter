import { RedocStandalone } from "redoc";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";

export function RedocDisplay({ url }: { url: string }) {
  const appCtx = useContext(AppContext);
  const { isMobileView } = appCtx;
  //
  // This sets the rendered URL, so that the <elements-api>
  // is removed and re-added each time the URL changes.
  // so, on-change:
  //   1. renderedUrl=undefined
  //   2. renderedUrl="..."
  //
  const [renderedUrl, setRenderedUrl] = useState<string | undefined>();
  useEffect(() => {
    if (renderedUrl === url) return;
    setRenderedUrl(undefined);
  }, [url]);
  useEffect(() => {
    if (renderedUrl !== undefined) return;
    setRenderedUrl(url);
  }, [renderedUrl]);

  /* eslint-disable no-console */
  console.log(renderedUrl);
  /* eslint-enable no-console */
  return (
    <div className="redocDisplayContainer">
      {renderedUrl !== undefined && (
        <RedocStandalone
          spec={renderedUrl}
          options={{ layout: isMobileView ? "stacked" : "three-panel" }}
        />
      )}
    </div>
  );
}
