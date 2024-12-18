import { Alert, Box, CloseButton, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icon } from "../../../../Assets/Icons";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { copyToClipboard } from "../../../../Utility/utility";
import { Button } from "../../../Common/Button";

const ViewCreatedItemModal = ({
  itemToCopyValue,
  itemToCopyName,
  createdObjectName,
  additionalContentTop,
  additionalContentBottom,
  open,
  onCloseModal,
}: {
  itemToCopyValue: string;
  itemToCopyName: string;
  createdObjectName: string;
  additionalContentTop?: React.ReactNode;
  additionalContentBottom?: React.ReactNode;
  open: boolean;
  onCloseModal: () => void;
}) => {
  const [hasCopiedItem, setHasCopiedItem] = useState(false);

  useEffect(() => {
    // Reset state on close.
    if (!open) {
      setHasCopiedItem(false);
    }
  }, [open]);

  const handleOnClose = () => {
    if (!hasCopiedItem) {
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
          <FormModalStyles.Title>
            Created {createdObjectName}
          </FormModalStyles.Title>
        </Box>
        {hasCopiedItem && (
          <CloseButton
            title="Close modal"
            size={"30px"}
            onClick={handleOnClose}
          />
        )}
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <Box m="20px">
        {additionalContentTop}

        <Flex mt="20px" mb="20px" justify={"center"} wrap={"wrap"}>
          <Flex
            w="100%"
            justify={"center"}
            mb="15px"
            sx={{ fontSize: "1.25rem" }}
          >
            {itemToCopyName}
          </Flex>
          <Button
            color={hasCopiedItem ? "success" : "secondary"}
            variant="outline"
            aria-label={`Copy this ${itemToCopyName}`}
            onClick={() => {
              copyToClipboard(itemToCopyValue).then(() => {
                toast.success(`Copied ${itemToCopyName} to clipboard`);
                setHasCopiedItem(true);
              });
            }}
          >
            <Flex justify={"center"} align={"center"} gap={"10px"}>
              {itemToCopyValue}
              {hasCopiedItem ? <Icon.SlashedCopy /> : <Icon.Copy />}
            </Flex>
          </Button>
        </Flex>
        <Alert
          my="30px"
          variant="light"
          icon={<Icon.InfoExclamation />}
          title="Warning!"
          color="orange"
        >
          This {itemToCopyName} value will not be available later. Please click
          the {itemToCopyName} value to copy and secure this value now.
        </Alert>

        {additionalContentBottom}

        <Flex justify={"flex-end"} gap="20px">
          <Button
            disabled={!hasCopiedItem}
            variant="outline"
            onClick={handleOnClose}
            type="button"
          >
            {hasCopiedItem ? "Close" : `Copy the ${itemToCopyName} above`}
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default ViewCreatedItemModal;
