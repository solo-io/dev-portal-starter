import { Button, Tooltip } from "@mantine/core";
import { useState } from "react";
import { App } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
import { DetailsPageStyles } from "../../../Styles/shared/DetailsPageStyles";
import { EditAppModal } from "./Modals/EditAppModal";

const EditAppButtonWithModal = ({ app }: { app: App }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  return (
    <>
      <DetailsPageStyles.EditButtonAndTooltipContainer>
        <Tooltip label="Edit App">
          <Button variant="subtle" onClick={() => setShowEditModal(true)}>
            <Icon.Pencil />
          </Button>
        </Tooltip>
      </DetailsPageStyles.EditButtonAndTooltipContainer>
      <EditAppModal
        app={app}
        opened={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

export default EditAppButtonWithModal;
