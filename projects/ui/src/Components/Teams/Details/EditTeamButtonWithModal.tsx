import { Tooltip } from "@mantine/core";
import { useState } from "react";
import { Team } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
import { DetailsPageStyles } from "../../../Styles/shared/DetailsPageStyles";
import { Button } from "../../Common/Button";
import { EditTeamModal } from "./Modals/EditTeamModal";

const EditTeamButtonWithModal = ({ team }: { team: Team }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  return (
    <>
      <DetailsPageStyles.EditButtonAndTooltipContainer>
        <Tooltip label="Edit Team">
          <Button
            isText={false}
            variant="subtle"
            onClick={() => setShowEditModal(true)}
          >
            <Icon.Pencil />
          </Button>
        </Tooltip>
      </DetailsPageStyles.EditButtonAndTooltipContainer>
      <EditTeamModal
        team={team}
        opened={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

export default EditTeamButtonWithModal;
