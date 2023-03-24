import { APIKey } from "../../Apis/api-types";
import { useDeleteApiKey } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { Button } from "./Button";
import { Modal } from "./Modal";

export function ConfirmationModal({
  apiKey,
  onClose,
}: {
  apiKey: APIKey;
  onClose: (success?: boolean) => any;
}) {
  useDeleteApiKey();

  const [attemptingDelete, setAttemptingDelete] = useState(false);

  const attemptDelete = () => {
    setAttemptingDelete(true);

    // TODO :: TRY TO DELETE
    //  CLOSE ON SUCCESS
    //  TAKE OFF ATTEMPTING DELETE ON FAILURE, GIVE MESSAGE
  };

  return (
    <Modal
      headContent={
        <div>
          <Icon.WarningExclamation />
          <div>{apiKey.apiId}</div>
        </div>
      }
      title={"Are you sure you want to remove this API Key?"}
      bodyContent={
        <div>
          <Button aria-hidden={attemptingDelete} onClick={attemptDelete}>
            DELETE
          </Button>
          <Button aria-hidden={attemptingDelete} onClick={onClose}>
            CANCEL
          </Button>
        </div>
      }
    />
  );
}
