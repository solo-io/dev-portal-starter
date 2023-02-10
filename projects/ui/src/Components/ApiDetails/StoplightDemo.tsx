import { APIProps } from "@stoplight/elements";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elements-api": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & APIProps,
        HTMLElement
      >;
    }
  }
}

function StoplightDemo({ url }: { url: string }) {
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

  return (
    <div>
      {renderedUrl !== undefined && (
        <elements-api
          apiDescriptionUrl={renderedUrl}
          router="hash"
          layout={isMobileView ? "stacked" : "sidebar"}
        />
      )}
    </div>
  );
}

export default StoplightDemo;
