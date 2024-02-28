import { APIProduct, APIVersion } from "../../Apis/api-types";
import { useGetApiDetails } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { Loading } from "../Common/Loading";
import { ApiDetailsPageStyles as Styles } from "./ApiDetailsPage.style";
import { ApiSchemaDisplay } from "./SchemaTab/ApiSchemaDisplay";

export function ApiDetailsPageContent({
  api,
  apiVersion,
}: {
  api: APIProduct;
  apiVersion: APIVersion;
}) {
  const { data: apiSchema, isLoading } = useGetApiDetails(apiVersion.apiId);

  return (
    <div>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={api.apiProductDisplayName}
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
            <Styles.ApiDetailsHeaderAddition>
              <Styles.ApiDetailsExtraInfo>
                <Icon.HtmlTag /> {Object.keys(apiSchema.paths).length}{" "}
                Operations
              </Styles.ApiDetailsExtraInfo>
              <Styles.ApiDetailsExtraInfo>
                <Icon.OpenApiIcon /> OpenAPI
              </Styles.ApiDetailsExtraInfo>
              <Styles.ApiDetailsExtraInfo>
                Version: {apiVersion.apiVersion}
              </Styles.ApiDetailsExtraInfo>
            </Styles.ApiDetailsHeaderAddition>
          ) : undefined
        }
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "APIs", link: "/apis" },
          { label: apiSchema?.info.title ?? "" },
        ]}
      />

      <ErrorBoundary fallback="There was an issue displaying the schema details">
        {isLoading || !apiSchema ? (
          <Loading message={`Retrieving schema for ${apiVersion.apiId}...`} />
        ) : (
          <ApiSchemaDisplay apiSchema={apiSchema} apiId={apiVersion.apiId} />
        )}
      </ErrorBoundary>
    </div>
  );
}
