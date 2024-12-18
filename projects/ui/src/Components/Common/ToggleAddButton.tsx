import { Icon } from "../../Assets/Icons";
import { UtilityStyles } from "../../Styles/shared/Utility.style";
import { Button, ButtonVariant } from "./Button";

/**
 * Shared between details pages.
 */
const ToggleAddButton = ({
  topicUpperCase,
  isAdding,
  toggleAdding,
  variant = "subtle",
}: {
  variant?: ButtonVariant;
  topicUpperCase: string;
  isAdding: boolean;
  toggleAdding: () => void;
}) => {
  return (
    <Button variant={variant} onClick={toggleAdding}>
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
