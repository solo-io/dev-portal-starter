import { Box, CloseButton, Flex } from "@mantine/core";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useNavigate } from "react-router-dom";
import { App } from "../../../../Apis/api-types";
import { useDeleteAppMutation } from "../../../../Apis/gg_hooks";
import { FormModalStyles } from "../../../../Styles/shared/FormModalStyles";
import { Button } from "../../../Common/Button";

const DeleteAppModal = ({
  app,
  open,
  onClose,
}: {
  app: App;
  open: boolean;
  onClose: () => void;
}) => {
  di(useDeleteAppMutation);
  const navigate = useNavigate();
  const { trigger: deleteApp } = useDeleteAppMutation();
  const onConfirm = async (e?: FormEvent) => {
    e?.preventDefault();
    await toast.promise(deleteApp({ appId: app.id }), {
      error: (e) => "There was an error deleting the app. " + e,
      loading: "Deleting the app...",
      success: "Deleted the app!",
    });
    onClose();
    navigate("/");
  };

  //
  // Render
  //
  return (
    <FormModalStyles.CustomModal onClose={onClose} opened={open} size={"600px"}>
      <FormModalStyles.HeaderContainer>
        <div>
          <FormModalStyles.Title>Delete App</FormModalStyles.Title>
          <FormModalStyles.Subtitle>
            Are you sure that you want to delete this app?
          </FormModalStyles.Subtitle>
        </div>
        <CloseButton title="Close modal" size={"30px"} onClick={onClose} />
      </FormModalStyles.HeaderContainer>
      <FormModalStyles.HorizLine />
      <Box p="20px 30px 40px 30px">
        <Flex justify={"flex-end"} gap="20px">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button color="danger" onClick={onConfirm} type="submit">
            Delete App
          </Button>
        </Flex>
      </Box>
    </FormModalStyles.CustomModal>
  );
};

export default DeleteAppModal;
