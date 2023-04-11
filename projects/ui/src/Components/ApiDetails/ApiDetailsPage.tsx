import { useParams } from "react-router-dom";
import { APISchema } from "../../Apis/api-types";
import { useGetApiDetails } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { ApiSchemaDisplay } from "./ApiSchemaDisplay";

/**
 * HELPER COMPONENT
 **/
function HeaderSummary({ apiSchema }: { apiSchema: APISchema }) {
  return (
    <div className="apiDetailsHeaderAddition">
      <div className="apiDetailsExtraInfo">
        <Icon.HtmlTag /> {Object.keys(apiSchema.paths).length} Operations
      </div>
      <div className="apiDetailsExtraInfo">
        <Icon.OpenApiIcon /> OpenAPI
      </div>
    </div>
  );
}

/**
 * MAIN COMPONENT
 **/
export function ApiDetailsPage() {
  const { apiId } = useParams();

  const { data: apiSchema } = useGetApiDetails(apiId);

  return (
    <div>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={apiSchema?.info.title ?? apiId ?? "Unsupported Schema"}
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
          !!apiSchema ? <HeaderSummary apiSchema={apiSchema} /> : undefined
        }
      />

      <ErrorBoundary fallback="There was an issue displaying the schema details">
        <ApiSchemaDisplay />
      </ErrorBoundary>
    </div>
  );
}
