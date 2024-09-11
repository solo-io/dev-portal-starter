import { Alert, Box, CloseButton, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icon } from "../../../../Assets/Icons";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { copyToClipboard } from "../../../../Utility/utility";
import { Button } from "../../../Common/Button";

const ViewCreatedApiKeyModal = ({
  apiKey,
  open,
  onCloseModal,
}: {
  apiKey: string;
  open: boolean;
  onCloseModal: () => void;
}) => {
  const [hasCopiedKey, setHasCopiedKey] = useState(false);

  useEffect(() => {
    // Reset state on close.
    if (!open) {
      setHasCopiedKey(false);
    }
  }, [open]);

  const handleOnClose = () => {
    if (!hasCopiedKey) {
      return;
    }
    onCloseModal();
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal
      onClose={handleOnClose}
      opened={open}
      size={"600px"}
    >
      <FormModalStyles.HeaderContainer>
        <Box ml="5px" mt="15px">
          <FormModalStyles.Title>Created API Key</FormModalStyles.Title>
        </Box>
        {hasCopiedKey && (
          <CloseButton
            title="Close modal"
            size={"30px"}
            onClick={handleOnClose}
          />
        )}
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <Box m="20px">
        <Alert
          my="30px"
          variant="light"
          icon={<Icon.InfoExclamation />}
          title="Warning!"
          color="orange"
        >
          This API Key value will not be available later. Please click the API
          Key value to copy and secure this value now.
        </Alert>
        <Flex mt="20px" mb="40px" justify={"center"}>
          <Button
            color={hasCopiedKey ? "success" : "secondary"}
            variant="outline"
            aria-label="Copy this API key"
            onClick={() => {
              copyToClipboard(apiKey).then(() => {
                toast.success("Copied API key to clipboard");
                setHasCopiedKey(true);
              });
            }}
          >
            <Flex justify={"center"} align={"center"} gap={"10px"}>
              {apiKey}
              {hasCopiedKey ? <Icon.SlashedCopy /> : <Icon.Copy />}
            </Flex>
          </Button>
        </Flex>
        <Flex justify={"flex-end"} gap="20px">
          <Button
            disabled={!hasCopiedKey}
            variant="outline"
            onClick={handleOnClose}
            type="button"
          >
            {hasCopiedKey ? "Close" : "Copy the API Key above"}
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default ViewCreatedApiKeyModal;
