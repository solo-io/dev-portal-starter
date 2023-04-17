import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDeleteKeyMutation } from "../../../Apis/hooks";
import { Icon } from "../../../Assets/Icons";
import { Button } from "../../Common/Button";
import { Modal } from "../../Common/Modal";

function DeleteKeyActions({
  apiKeyId,
  usagePlanName,
  onSuccess,
  onClose,
}: {
  apiKeyId: string;
  usagePlanName: string;
  onSuccess: () => void;
  onClose: () => any;
}) {
  const [attemptingDelete, setAttemptingDelete] = useState(false);
  const { trigger: deleteKey, isMutating } = useDeleteKeyMutation();

  const attemptToDelete = async () => {
    if (!apiKeyId || !!attemptingDelete) return;
    setAttemptingDelete(true);
    await toast.promise(deleteKey({ apiKeyId, usagePlanName }), {
      loading: "Deleting the API key...",
      success: "API key deleted!",
      error: "There was an error deleting the API key.",
    });
    onSuccess();
  };

  // Set attempting to delete = false when finished creating the key.
  useEffect(() => {
    if (!attemptingDelete || !!isMutating) return;
    setAttemptingDelete(false);
  }, [attemptingDelete, isMutating]);

  return (
    <div className="deleteKeyActions">
      <Button
        className="error"
        disabled={attemptingDelete}
        onClick={attemptToDelete}
        title={"Confirm deleting this key"}
      >
        DELETE
      </Button>
      <Button
        className="paleButton"
        disabled={attemptingDelete}
        onClick={onClose}
        title={"Back out of this window without deleting"}
      >
        CANCEL
      </Button>
    </div>
  );
}

export function DeleteApiKeyModal({
  apiKeyName,
  apiKeyId,
  usagePlanName,
  onClose,
}: {
  apiKeyName: string;
  apiKeyId: string;
  usagePlanName: string;
  onClose: () => any;
}) {
  const [deleted, setDeleted] = useState(false);

  return (
    <Modal
      onClose={onClose}
      headContent={
        <>{deleted ? <Icon.SuccessCheckmark /> : <Icon.WarningExclamation />}</>
      }
      bodyContent={
        <>
          <div className="deleteKeyModal">
            <div className="deleteKeyName">{apiKeyName}</div>
            <div className="deleteKeyStatus">
              {deleted
                ? "Key Deleted Successfully!"
                : "Are you sure you want to delete this API Key?"}
            </div>
            {!deleted ? (
              <DeleteKeyActions
                apiKeyId={apiKeyId}
                usagePlanName={usagePlanName}
                onSuccess={() => setDeleted(true)}
                onClose={onClose}
              />
            ) : (
              <div className="deleteKeyActions">
                <Button
                  className="paleButton"
                  onClick={onClose}
                  title={"Close this modal"}
                >
                  CLOSE
                </Button>
              </div>
            )}
          </div>
        </>
      }
    />
  );
}
