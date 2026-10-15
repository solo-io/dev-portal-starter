import { Box, CloseButton, Flex } from "@mantine/core";
import { FormEvent, ReactNode } from "react";
import toast from "react-hot-toast";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { Button } from "../../../Common/Button";

const ConfirmDeleteCredentialModal = ({
  kind,
  credentialName,
  details,
  open,
  onConfirm,
  onClose,
}: {
  /** The credential's singular, title-case name, such as "API Key". */
  kind: string;
  credentialName: string;
  /** Anything else that tells this credential apart from the app's others. */
  details?: ReactNode;
  open: boolean;
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}) => {
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    await toast.promise(onConfirm(), {
      error: (e) => `There was an error deleting the ${kind}. ` + e,
      loading: `Deleting the ${kind}...`,
      success: `Deleted the ${kind}!`,
    });
    onClose();
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal onClose={onClose} opened={open} size={"600px"}>
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Delete {kind}</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to delete the {kind} "{credentialName}"?
            Anything still using it stops working immediately, and it cannot be
            restored.
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <Box p="20px 30px 40px 30px">
        {details && <Box mb="20px">{details}</Box>}
        <Flex justify={"flex-end"} gap="20px">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button color="danger" onClick={onSubmit} type="submit">
            Delete {kind}
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default ConfirmDeleteCredentialModal;
