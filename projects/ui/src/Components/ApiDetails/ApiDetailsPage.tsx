import { useParams } from "react-router-dom";
import {
  BannerHeading,
  BannerHeadingTitle,
} from "../Common/Banner/BannerHeading";
import { Icon } from "../../Assets/Icons";
import { ApiSchemaDisplay } from "./ApiSchemaDisplay";
import { useGetApiDetails } from "../../Apis/hooks";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { APISchema } from "../../Apis/api-types";

function HeaderSummary({ apiSchema }: { apiSchema: APISchema }) {
  return (
    <div className="apiDetailsHeaderAddition">
      <div>
        <Icon.HtmlTag /> {Object.keys(apiSchema.paths).length} Operations
      </div>
      <div>
        <Icon.OpenApiIcon /> OpenAPI
      </div>
    </div>
  );
}

export function ApiDetailsPage() {
  const { apiId } = useParams();

  const { data: apiSchema } = useGetApiDetails(apiId);

  return (
    <div>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={apiSchema?.info.title ?? apiId}
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

      <main className="page-container-wrapper">
        <ErrorBoundary fallback="There was an issue displaying the schema details">
          <ApiSchemaDisplay />
        </ErrorBoundary>
      </main>
    </div>
  );
}
