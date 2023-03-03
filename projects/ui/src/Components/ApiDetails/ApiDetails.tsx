import { useState } from "react";
import { useParams } from "react-router-dom";
import { RedocDisplay } from "./RedocDisplay";
import {
  BannerHeading,
  BannerHeadingTitle,
} from "../Common/Banner/BannerHeading";
import { Icon } from "../../Assets/Icons";

export function ApiDetails() {
  const { apiId } = useParams();
  //
  // URL for the API
  //
  const [url] = useState(
    // "https://api.apis.guru/v2/specs/github.com/1.1.4/openapi.yaml"
    "http://localhost:4000/openapi.yaml"
  );

  return (
    <div className="NOTICEME NOTICE ME">
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={apiId}
            additionalInfo={
              <div style={{ color: "blue", fontSize: "12px" }}>Modified by</div>
            }
            stylingTweaks={{
              fontSize: "32px",
              lineHeight: "36px",
            }}
          />
        }
        fullIcon={<Icon.Bug />}
        description={
          "Browse the list of APIs and documentation in this portal. From here you can get the information you need to make API calls."
        }
        additionalContent={
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <div style={{ display: "flex" }}>
              <Icon.HtmlTag /> {4} Operations
            </div>
            <div style={{ display: "flex" }}>
              <Icon.OpenApiIcon /> {"OpenAPI"}
            </div>
          </div>
        }
      />

      <main className="page-container-wrapper">
        <RedocDisplay url={url} />
      </main>
      {/* <API apiDescriptionUrl="https://raw.githubusercontent.com/stoplightio/Public-APIs/master/reference/zoom/openapi.yaml" /> */}
    </div>
  );
}
