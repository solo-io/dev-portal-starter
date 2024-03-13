import { Button } from "@mantine/core";
import { Icon } from "../../Assets/Icons";
import { UtilityStyles } from "../../Styles/shared/Utility.style";

/**
 * Shared between details pages.
 */
const ToggleAddButton = ({
  topicUpperCase,
  isAdding,
  toggleAdding,
}: {
  topicUpperCase: string;
  isAdding: boolean;
  toggleAdding: () => void;
}) => {
  return (
    <Button variant="subtle" onClick={toggleAdding}>
      <UtilityStyles.ButtonContentsWithIcon>
        {isAdding ? (
          <>
            CANCEL
            <Icon.FilledGrayXIcon />
          </>
        ) : (
          <>
            ADD {topicUpperCase}
            <Icon.PlusIcon />
          </>
        )}
      </UtilityStyles.ButtonContentsWithIcon>
    </Button>
  );
};
export default ToggleAddButton;
