import { Box } from "@mantine/core";
import { di } from "react-magnetic-di";
import { ApiProductDetails, ApiVersion } from "../../Apis/api-types";
import { useGetApiDetails, useGetApiProductVersions } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { EmptyData } from "../Common/EmptyData";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { ApiProductDetailsPageStyles as Styles } from "./ApiProductDetailsPage.style";

export function ApiProductDetailsPageContent({
  apiProduct,
  apiProductVersions,
  selectedApiVersion,
  onSelectedApiVersionChange,
}: {
  apiProduct: ApiProductDetails;
  apiProductVersions: ApiVersion[];
  selectedApiVersion: ApiVersion | null;
  onSelectedApiVersionChange: (newVersionId: string | null) => void;
}) {
  di(useGetApiDetails, useGetApiProductVersions);
  // const { data: apiSchema, isLoading } = useGetApiDetails(apiVersion?.id);

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
          // !!apiSchema && selectedApiVersion ? (
          selectedApiVersion ? (
            <Styles.ApiDetailsHeaderAddition>
              <Styles.ApiDetailsExtraInfo>
                {/* <Icon.HtmlTag /> {Object.keys(apiSchema.paths).length}{" "} */}
                Operations
              </Styles.ApiDetailsExtraInfo>
              <Styles.ApiDetailsExtraInfo>
                <Icon.OpenApiIcon /> OpenAPI
              </Styles.ApiDetailsExtraInfo>
              <Styles.ApiDetailsExtraInfo>
                Version: {selectedApiVersion.name}
              </Styles.ApiDetailsExtraInfo>
            </Styles.ApiDetailsHeaderAddition>
          ) : undefined
        }
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "APIs", link: "/apis" },
          { label: apiProduct.name },
        ]}
      />

      {!!selectedApiVersion ? (
        <ErrorBoundary fallback="There was an issue displaying the schema details">
          {/* {isLoading || !apiSchema ? (
            <Loading message={`Retrieving schema for ${apiVersion.id}...`} />
          ) : (
            <ApiSchemaDisplay apiSchema={apiSchema} apiId={apiVersion.id} />
          )} */}
        </ErrorBoundary>
      ) : (
        !apiProductVersions?.length && (
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
