import { Box } from "@mantine/core";
import { di } from "react-magnetic-di";
import { ApiProductDetails, ApiVersion } from "../../Apis/api-types";
import { useGetApiDetails } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { EmptyData } from "../Common/EmptyData";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { Loading } from "../Common/Loading";
import { ApiProductDetailsPageStyles as Styles } from "./ApiProductDetailsPage.style";
import { ApiSchemaDisplay } from "./SchemaTab/ApiSchemaDisplay";

export function ApiProductDetailsPageContent({
  apiProduct,
  apiVersion,
}: {
  apiProduct: ApiProductDetails;
  apiVersion: ApiVersion | null;
}) {
  di(useGetApiDetails);
  const { data: apiSchema, isLoading } = useGetApiDetails(apiVersion?.id);

  return (
    <div>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={apiProduct.name}
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
          !!apiSchema && apiVersion ? (
            <Styles.ApiDetailsHeaderAddition>
              <Styles.ApiDetailsExtraInfo>
                <Icon.HtmlTag /> {Object.keys(apiSchema.paths).length}{" "}
                Operations
              </Styles.ApiDetailsExtraInfo>
              <Styles.ApiDetailsExtraInfo>
                <Icon.OpenApiIcon /> OpenAPI
              </Styles.ApiDetailsExtraInfo>
              <Styles.ApiDetailsExtraInfo>
                Version: {apiVersion.name}
              </Styles.ApiDetailsExtraInfo>
            </Styles.ApiDetailsHeaderAddition>
          ) : undefined
        }
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "APIs", link: "/apis" },
          { label: apiSchema?.info?.title ?? "" },
        ]}
      />
      {}

      {!!apiVersion ? (
        <ErrorBoundary fallback="There was an issue displaying the schema details">
          {isLoading || !apiSchema ? (
            <Loading message={`Retrieving schema for ${apiVersion.id}...`} />
          ) : (
            <ApiSchemaDisplay apiSchema={apiSchema} apiId={apiVersion.id} />
          )}
        </ErrorBoundary>
      ) : (
        !apiProduct.versions?.length && (
          <Box m="60px">
            <EmptyData
              topicMessageOverride={`The API Product, "${apiProduct.name}", has no API Version data.`}
            />
          </Box>
        )
      )}
    </div>
  );
}
