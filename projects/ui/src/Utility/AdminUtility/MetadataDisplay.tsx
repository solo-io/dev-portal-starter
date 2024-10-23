import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { App, RateLimit, Subscription } from "../../Apis/api-types";
import { useIsAdmin } from "../../Context/AuthContext";
import { useInArea } from "../utility";
import { CustomMetadataEditor } from "./CustomMetadataEditor";
import { RateLimitSection } from "./RateLimitSection";

export interface SharedMetadataProps {
  item: App | Subscription;
  customMetadata: Record<string, string> | undefined;
  rateLimitInfo: RateLimit | undefined;
}

/**
 * The `MetadataDisplay` handles the viewing and editing of custom metadata and rate limit information.
 */
export const MetadataDisplay = ({
  customMetadata,
  rateLimitInfo,
  onIsWideChange,
  ...props
}: SharedMetadataProps & {
  onIsWideChange?: (newIsWide: boolean) => void;
}) => {
  const isAdmin = useIsAdmin();
  const [isEditingCustomMetadata, setIsEditingCustomMetadata] = useState(false);
  const [isEditingRateLimit, setIsEditingRateLimit] = useState(false);

  useEffect(() => {
    onIsWideChange?.(isEditingCustomMetadata || isEditingCustomMetadata);
  }, [isEditingCustomMetadata, isEditingRateLimit]);

  const inAppDetailsPage = useInArea([`apps/${props.item.id}`]);
  const isSubscription = "apiProductId" in props.item;

  // This component is reused for apps and subscription rate limit & metadata.
  // Here we show the rate limit when:
  // - This is an admin
  // - We are on the app details page
  // - This is a subscription
  const showingRateLimit = !!isAdmin || inAppDetailsPage || isSubscription;

  return (
    <Box sx={{ textAlign: "left", width: "100%" }}>
      <CustomMetadataEditor
        isEditingCustomMetadata={isEditingCustomMetadata}
        onIsEditingCustomMetadataChange={(value) =>
          setIsEditingCustomMetadata(value)
        }
        customMetadata={customMetadata}
        rateLimitInfo={rateLimitInfo}
        {...props}
      />
      {showingRateLimit && (
        <Box mb="10px">
          <RateLimitSection
            inAppDetailsPage={inAppDetailsPage}
            isSubscription={isSubscription}
            isEditingRateLimit={isEditingRateLimit}
            onIsEditingRateLimitChange={(newIsEditingRateLimit) =>
              setIsEditingRateLimit(newIsEditingRateLimit)
            }
            customMetadata={customMetadata}
            rateLimitInfo={rateLimitInfo}
            {...props}
          />
        </Box>
      )}
    </Box>
  );
};
