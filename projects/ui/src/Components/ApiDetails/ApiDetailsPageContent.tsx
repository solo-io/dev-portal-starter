import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { APIProduct, APISchema, APIVersion } from "../../Apis/api-types";
import { useGetApiDetails } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { Loading } from "../Common/Loading";
import { ApiSchemaDisplay } from "./ApiSchemaDisplay";

const ApiDetailsHeaderAddition = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 18px;
    font-weight: 500;
    color: ${theme.defaultColoredText};
  `
);

const ApiDetailsExtraInfo = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    margin-right: 25px;

    svg {
      width: 23px;
      height: 23px;
      margin-right: 8px;

      * {
        fill: ${theme.primary};
      }
    }
  `
);

/**
 * HELPER COMPONENT
 **/
function HeaderSummary({
  apiSchema,
  apiVersion,
}: {
  apiSchema: APISchema;
  apiVersion: APIVersion;
}) {
  return (
    <ApiDetailsHeaderAddition>
      <ApiDetailsExtraInfo>
        <Icon.HtmlTag /> {Object.keys(apiSchema.paths).length} Operations
      </ApiDetailsExtraInfo>
      <ApiDetailsExtraInfo>
        <Icon.OpenApiIcon /> OpenAPI
      </ApiDetailsExtraInfo>
      <ApiDetailsExtraInfo>
        Version: {apiVersion.apiVersion}
      </ApiDetailsExtraInfo>
    </ApiDetailsHeaderAddition>
  );
}

/**
 * MAIN COMPONENT
 **/
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
            <HeaderSummary apiSchema={apiSchema} apiVersion={apiVersion} />
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
