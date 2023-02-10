import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoplightDemo from "./StoplightDemo";

function ApiDetails() {
  const { apiId } = useParams();
  //
  // URL for the API
  //
  const [url, setUrl] = useState(
    "https://api.apis.guru/v2/specs/github.com/1.1.4/openapi.yaml"
  );
  const [urlToDisplay, setUrlToDisplay] = useState(url);
  useEffect(() => {
    const debounceMs = 500;
    const urlTimeout = setTimeout(() => setUrl(urlToDisplay), debounceMs);
    return () => {
      clearTimeout(urlTimeout);
    };
  }, [urlToDisplay, setUrl]);

  //
  // Render
  //
  return (
    <div>
      <div className="sl-px-3 sl-prose sl-inverted sl-bg-canvas-100">
        <div className="sl-flex">
          <p
            style={{ whiteSpace: "nowrap" }}
            className="sl-pr-3 sl-py-1 sl-mb-3"
          >
            OpenApi URL ({apiId}):
          </p>
          <input
            className="sl-bg-canvas-300 sl-relative sl-w-full sl-h-lg sl-text-base sl-pr-2.5 sl-pl-2.5 sl-rounded sl-border-light hover:sl-border-input focus:sl-border-primary sl-border"
            placeholder="URL"
            type="text"
            value={urlToDisplay}
            onChange={(e) => setUrlToDisplay(e.target.value)}
          />
          <p
            style={{
              whiteSpace: "nowrap",
              marginTop: ".25rem",
            }}
            className="sl-pl-3"
          >
            <a href={`/usage-plans/${apiId}`}>Usage Plans</a>
          </p>
        </div>
      </div>
      <div>
        <StoplightDemo url={url} />
      </div>
      {/* <API apiDescriptionUrl="https://raw.githubusercontent.com/stoplightio/Public-APIs/master/reference/zoom/openapi.yaml" /> */}
    </div>
  );
}

export default ApiDetails;
