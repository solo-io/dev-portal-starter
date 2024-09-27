import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { App, RateLimit, Subscription } from "../../Apis/api-types";
import { CustomMetadataEditor } from "./CustomMetadataEditor";
import { RateLimitEditor } from "./RateLimitEditor";

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
  const [isEditingCustomMetadata, setIsEditingCustomMetadata] = useState(false);
  const [isEditingRateLimit, setIsEditingRateLimit] = useState(false);

  useEffect(() => {
    onIsWideChange?.(isEditingCustomMetadata || isEditingCustomMetadata);
  }, [isEditingCustomMetadata, isEditingRateLimit]);

  return (
    <Box sx={{ textAlign: "left" }}>
      <Box mb={!!customMetadata || !!isEditingCustomMetadata ? "10px" : "0px"}>
        <CustomMetadataEditor
          isEditingCustomMetadata={isEditingCustomMetadata}
          onIsEditingCustomMetadataChange={(value) =>
            setIsEditingCustomMetadata(value)
          }
          customMetadata={customMetadata}
          rateLimitInfo={rateLimitInfo}
          {...props}
        />
      </Box>
      <Box mb="10px">
        <RateLimitEditor
          isEditingRateLimit={isEditingRateLimit}
          onIsEditingRateLimitChange={(newIsEditingRateLimit) =>
            setIsEditingRateLimit(newIsEditingRateLimit)
          }
          customMetadata={customMetadata}
          rateLimitInfo={rateLimitInfo}
          {...props}
        />
      </Box>
    </Box>
  );
};
