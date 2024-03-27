import { Flex, Select } from "@mantine/core";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  ApiProductDetails,
  ApiVersion,
  ApiVersionSchema,
} from "../../Apis/api-types";
import { Icon } from "../../Assets/Icons";
import { FormModalStyles } from "../../Styles/shared/FormModalStyles";
import { downloadFile } from "../../Utility/utility";
import NewSubscriptionModal from "../Apps/Details/Modals/NewSubscriptionModal";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { ApiProductDetailsPageStyles as Styles } from "./ApiProductDetailsPage.style";

const ApiProductDetailsPageHeading = ({
  apiProduct,
  apiProductVersions,
  selectedApiVersion,
  onSelectedApiVersionChange,
  apiVersionSpec,
}: {
  apiProduct: ApiProductDetails;
  apiProductVersions: ApiVersion[];
  selectedApiVersion: ApiVersion | null;
  onSelectedApiVersionChange: (newVersionId: string | null) => void;
  apiVersionSpec: ApiVersionSchema | undefined;
}) => {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const downloadApiSpec = () => {
    if (!selectedApiVersion?.apiSpec) {
      return;
    }
    const fileName = selectedApiVersion.name + "_api-spec.json";
    if (typeof selectedApiVersion.apiSpec === "string") {
      downloadFile(fileName, selectedApiVersion.apiSpec);
    } else {
      downloadFile(fileName, JSON.stringify(selectedApiVersion.apiSpec));
    }
    toast.success("Downloaded " + fileName);
  };

  return (
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
      description={
        !!apiProduct.description
          ? apiProduct.description
          : "Browse the list of APIs and documentation in this portal. From here you can get the information you need to make API calls."
      }
      additionalContent={
        selectedApiVersion ? (
          <Styles.ApiDetailsHeaderAddition>
            <Flex gap={"10px"}>
              {!!apiVersionSpec?.paths && (
                <Styles.ApiDetailsExtraInfo>
                  <Icon.HtmlTag /> {Object.keys(apiVersionSpec.paths).length}{" "}
                  Operations
                </Styles.ApiDetailsExtraInfo>
              )}
              <Styles.ApiDetailsExtraInfo>
                <Icon.OpenApiIcon /> OpenAPI
              </Styles.ApiDetailsExtraInfo>
            </Flex>
            <Flex gap="10px" align={"center"} sx={{ flexWrap: "wrap" }}>
              {apiProductVersions.length > 0 && (
                <FormModalStyles.InputContainer grow>
                  <Select
                    id="api-version-select"
                    aria-label="API version selection"
                    // This className="" is intentional and removes the antd select dropdown classname.
                    className=""
                    value={selectedApiVersion.id}
                    onChange={(value) => {
                      onSelectedApiVersionChange(value ?? "");
                    }}
                    data={apiProductVersions.map((v) => ({
                      value: v.id,
                      label: v.name,
                    }))}
                  />
                </FormModalStyles.InputContainer>
              )}
              <Button onClick={() => setShowSubscribeModal(true)}>
                SUBSCRIBE
              </Button>
              <Button
                disabled={!selectedApiVersion.apiSpec}
                onClick={downloadApiSpec}
              >
                DOWNLOAD SPEC
              </Button>
            </Flex>
            <NewSubscriptionModal
              opened={showSubscribeModal}
              onClose={() => setShowSubscribeModal(false)}
              apiProduct={apiProduct}
            />
          </Styles.ApiDetailsHeaderAddition>
        ) : undefined
      }
      breadcrumbItems={[
        { label: "Home", link: "/" },
        { label: "APIs", link: "/apis" },
        { label: apiProduct.name },
      ]}
    />
  );
};

export default ApiProductDetailsPageHeading;
