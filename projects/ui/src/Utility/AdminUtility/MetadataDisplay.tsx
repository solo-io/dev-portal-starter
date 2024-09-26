import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { App, RateLimit, Subscription } from "../../Apis/api-types";
import { Button } from "../../Components/Common/Button";
import { useIsAdmin } from "../../Context/AuthContext";
import { MetadataEditor } from "./MetadataEditor";

export interface SharedMetadataProps {
  item: App | Subscription;
  customMetadata: Record<string, string> | undefined;
  rateLimitInfo: RateLimit | undefined;
}

export const MetadataDisplay = ({
  customMetadata,
  rateLimitInfo,
  onIsEditingMetadataChange,
  ...props
}: SharedMetadataProps & {
  onIsEditingMetadataChange: (newIsEditingMetadata: boolean) => void;
}) => {
  const hasMetadataAndRateLimitInfo =
    !!Object.keys(customMetadata ?? {}).length && !!rateLimitInfo;
  const isAdmin = useIsAdmin();
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  useEffect(() => {
    onIsEditingMetadataChange(isEditingMetadata);
  }, [isEditingMetadata]);

  if (!hasMetadataAndRateLimitInfo && !isAdmin) {
    return null;
  }
  return (
    <Box mb="10px" sx={{ textAlign: "left" }}>
      {/* // ) : (
      //   <Box
      //     sx={{
      //       border: "1px solid " + colors.splashBlueDark10,
      //       backgroundColor: colors.dropBlue,
      //       borderRadius: borderRadiusConstants.small,
      //     }}
      //     p="10px 15px"
      //     my="5px"
      //   >
      //     <Text size="md" weight={500}>
      //       Metadata
      //     </Text>
      //     <Text size="sm">{JSON.stringify(customMetadata)}</Text>
      //   </Box>
      // )} */}
      {isEditingMetadata ? (
        <MetadataEditor
          customMetadata={customMetadata}
          rateLimitInfo={rateLimitInfo}
          onClose={() => setIsEditingMetadata(false)}
          {...props}
        />
      ) : (
        <Button
          color="primary"
          size="xs"
          variant="outline"
          onClick={() => setIsEditingMetadata(!isEditingMetadata)}
        >
          {!hasMetadataAndRateLimitInfo ? "Create" : "Edit"} Metadata
        </Button>
      )}
    </Box>
  );
};
