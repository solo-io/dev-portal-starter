import { useParams } from "react-router-dom";
import {
  BannerHeading,
  BannerHeadingTitle,
} from "../Common/Banner/BannerHeading";
import { Icon } from "../../Assets/Icons";
import { ApiSchemaDisplay } from "./ApiSchemaDisplay";
import { useGetApiDetails } from "../../Apis/hooks";
import { ErrorBoundary } from "../Common/ErrorBoundary";

function HeaderSummary({
  apiYaml,
  type,
}: {
  apiYaml: { [key: string]: any };
  type: any;
}) {
  // parse yaml for operations
  // something like:
  /* 1. find path at top level, 
     2. check # of direct children of path, 
     3. ?? check # of ops per child ??
  */
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

export function ApiDetailsPage() {
  const { apiId } = useParams();

  const { data: apiSchema } = useGetApiDetails(apiId);

  return (
    <div>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={apiId}
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
          !!apiSchema ? (
            <HeaderSummary apiYaml={{}} type={apiSchema.isOpenApi} />
          ) : undefined
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
