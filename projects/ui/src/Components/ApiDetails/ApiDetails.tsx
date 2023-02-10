import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StoplightDemo from "./StoplightDemo";

function ApiDetails() {
  const { apiId } = useParams();
  //
  // URL for the API
  //
  const [url, setUrl] = useState(
    // "https://api.apis.guru/v2/specs/github.com/1.1.4/openapi.yaml"
    "http://localhost:4000/example_openapi.yaml"
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
            {/* <a href={`/usage-plans/${apiId}`}>Usage Plans</a> */}
            <Link to={`/usage-plans/${apiId}`}>Usage Plans</Link>
          </p>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        {/* <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
          }}
        >
          <Oval
            height={80}
            width={80}
            color="var(--color-primary)"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="var(--color-primary-dark)"
            strokeWidth={5}
            strokeWidthSecondary={5}
          />
        </div> */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <StoplightDemo url={url} />
        </div>
      </div>
      {/* <API apiDescriptionUrl="https://raw.githubusercontent.com/stoplightio/Public-APIs/master/reference/zoom/openapi.yaml" /> */}
    </div>
  );
}

export default ApiDetails;
