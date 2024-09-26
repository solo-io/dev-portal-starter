import { Box, Flex, Input, Text } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import { RateLimit } from "../../Apis/api-types";
import { Button } from "../../Components/Common/Button";
import ToggleAddButton from "../../Components/Common/ToggleAddButton";
import { useIsAdmin } from "../../Context/AuthContext";
import { colors } from "../../Styles";
import { borderRadiusConstants } from "../../Styles/constants";

const MetadataEditor = ({
  metadata,
  rateLimitInfo,
  onClose,
}: {
  metadata: Record<string, string> | undefined;
  rateLimitInfo: RateLimit | undefined;
  onClose: () => void;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = false;
  const [metaKey, setMetaKey] = useState("");
  const [metaValue, setMetaValue] = useState("");

  //
  //  Form Submit
  //
  // const { trigger: updateApp } = useUpdateAppMutation();
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
      return;
    }
    // await toast.promise(
    //   updateApp({
    //     appId: app.id,
    //     appName,
    //     appDescription,
    //     appTeamId: app.teamId,
    //   }),
    //   {
    //     error: "There was an error updating the metadata.",
    //     loading: "Updating the metadata.",
    //     success: "Updated the metadata!",
    //   }
    // );
    onClose();
  };

  return (
    <Box mt="10px">
      <form ref={formRef} onSubmit={onSubmit}>
        <Text size="lg" mb="5px">
          Edit Metadata
        </Text>
        <Flex gap="10px">
          <Flex sx={{ flexBasis: "50%" }}>
            <Flex direction="column">
              <Text size="sm">
                <label htmlFor="meta-key-input">Metadata Key</label>
              </Text>
              <Input
                id="meta-key-input"
                required
                placeholder="Metadata Key"
                autoComplete="off"
                value={metaKey}
                onChange={(e) => setMetaKey(e.target.value)}
              />
            </Flex>
          </Flex>
          <Flex sx={{ flexBasis: "50%" }}>
            <Flex direction="column">
              <Text size="sm">
                <label htmlFor="meta-value-input">Metadata Value</label>
              </Text>
              <Input
                id="meta-value-input"
                required
                placeholder="Metadata Value"
                autoComplete="off"
                value={metaValue}
                onChange={(e) => setMetaValue(e.target.value)}
              />
            </Flex>
          </Flex>
          <Flex direction="column" justify={"flex-end"}>
            <Button variant="outline" disabled={!metaValue || !metaKey}>
              Add Metadata
            </Button>
          </Flex>
        </Flex>

        {/* <Flex justify={"flex-end"} mt="20px">
          <Button disabled={isFormDisabled} onClick={onSubmit} type="submit">
            Update Metadata
          </Button>
        </Flex> */}
      </form>
    </Box>
  );
};

export const MetadataDisplay = ({
  customMetadata,
  rateLimitInfo,
  onIsManagingMetadataChange,
}: {
  itemType: "app" | "subscription";
  itemId: string;
  customMetadata: Record<string, string> | undefined;
  rateLimitInfo: RateLimit | undefined;
  onIsManagingMetadataChange: (newIsManagingMetadata: boolean) => void;
}) => {
  const hasMetadataAndRateLimitInfo =
    !!Object.keys(customMetadata ?? {}).length && !!rateLimitInfo;
  const isAdmin = useIsAdmin();
  const [isManagingMetadata, setIsManagingMetadata] = useState(false);
  useEffect(() => {
    onIsManagingMetadataChange(isManagingMetadata);
  }, [isManagingMetadata]);

  if (!hasMetadataAndRateLimitInfo && !isAdmin) {
    return null;
  }
  return (
    <Box mb="10px" sx={{ textAlign: "left" }}>
      {!hasMetadataAndRateLimitInfo ? (
        <ToggleAddButton
          variant="outline"
          topicUpperCase="METADATA"
          isAdding={isManagingMetadata}
          toggleAdding={() => setIsManagingMetadata(!isManagingMetadata)}
        />
      ) : (
        <Box
          sx={{
            border: "1px solid " + colors.splashBlueDark10,
            backgroundColor: colors.dropBlue,
            borderRadius: borderRadiusConstants.small,
          }}
          p="10px 15px"
          my="5px"
        >
          <Text size="md" weight={500}>
            Metadata
          </Text>
          <Text size="sm">{JSON.stringify(customMetadata)}</Text>
        </Box>
      )}
      {isManagingMetadata && (
        <MetadataEditor
          metadata={customMetadata}
          rateLimitInfo={rateLimitInfo}
          onClose={() => setIsManagingMetadata(false)}
        />
      )}
    </Box>
  );
};
