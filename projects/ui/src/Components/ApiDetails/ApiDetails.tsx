import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchJson, restpointPrefix } from "../../Apis/hooks";
import { API } from "../../Apis/api-types";
import { RedocDisplay } from "./RedocDisplay";
import {
  BannerHeading,
  BannerHeadingTitle,
} from "../Common/Banner/BannerHeading";
import { Icon } from "../../Assets/Icons";
/*import { API } from "../../Apis/api-types";
import { useQuery } from "@tanstack/react-query";
import { fetchJson, restpointPrefix } from "../../Apis/hooks";*/

function HeaderSummary({
  apiYaml,
  type,
}: {
  apiYaml: { [key: string]: any };
  type: any;
}) {
  // parse yaml for operations
  // something like 1. find path at top level, 2. check # of direct children of path, 3. ?? check # of ops per child??
  //const endpointsCount = 4;

  return (
    <div className="apiDetailsHeaderAddition">
      {/*<div>
        <Icon.HtmlTag /> {endpointsCount} Operations
  </div>*/}
      <div>
        <Icon.OpenApiIcon /> {type}
      </div>
    </div>
  );
}

export function ApiDetails() {
  const { apiId } = useParams();
  /*
  const {
    isLoading,
    isError,
    data: apiSchema,
    error,
  } = useQuery({
    queryKey: [`/apis/${apiId}/schema`],
    queryFn: () => fetchJson<API>(`${restpointPrefix}/apis/${apiId}/schema`),
  });*/

  /* eslint-disable no-console */
  //console.log(apiSchema);
  /* eslint-enable no-console */
  
  const apiSchema =
    "http://developer.example.com/v1/apis/tracks-rt-gloo-mesh-gateways-gg-demo-single/schema";
    

  return (
    <div className="NOTICEME NOTICE ME">
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={apiId}
            additionalInfo={
              /*<div style={{ color: "blue", fontSize: "12px" }}>Modified by</div>*/ undefined
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
          <HeaderSummary
            apiYaml={{}}
            type={/*apiSchema.isOpenApi*/ "OpenAPI"}
          />
        }
      />

      <main className="page-container-wrapper">
        <RedocDisplay url={apiSchema} />
      </main>
      {/* <API apiDescriptionUrl="https://raw.githubusercontent.com/stoplightio/Public-APIs/master/reference/zoom/openapi.yaml" /> */}
    </div>
  );
}
