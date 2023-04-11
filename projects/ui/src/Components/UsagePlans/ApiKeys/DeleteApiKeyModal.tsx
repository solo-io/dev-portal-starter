import { useEffect, useState } from "react";
import { useDeleteKeyMutation } from "../../../Apis/hooks";
import { Icon } from "../../../Assets/Icons";
import { Button } from "../../Common/Button";
import { Loading } from "../../Common/Loading";
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
  const [deleted, setDeleted] = useState(false);
  const { trigger: deleteKey, isMutating } = useDeleteKeyMutation();

  const attemptToDelete = async () => {
    if (!apiKeyId || !!attemptingDelete) return;
    setAttemptingDelete(true);
    await deleteKey({ apiKeyId, usagePlanName });
    onSuccess();
  };

  // Set attempting to delete = false when finished creating the key.
  useEffect(() => {
    if (!attemptingDelete || !!isMutating) return;
    setDeleted(true);
  }, [attemptingDelete, isMutating]);

  return (
    <div className="deleteKeyActions">
      {attemptingDelete ? (
        <Loading message="Deleting key..." />
      ) : deleted ? null : (
        <>
          <Button
            className="paleButton"
            onClick={onClose}
            title={"Back out of this window without deleting"}
          >
            CANCEL
          </Button>
          <Button onClick={attemptToDelete} title={"Confirm deleting this key"}>
            DELETE
          </Button>
        </>
      )}
    </div>
  );
}

export function DeleteApiKeyModal({
  apiKeyId,
  usagePlanName,
  onClose,
}: {
  apiKeyId: string;
  usagePlanName: string;
  onClose: () => any;
}) {
  const [deleted, setDeleted] = useState(false);
  const [closeTimer, setCloseTimer] = useState<
    NodeJS.Timeout | number | undefined
  >();

  useEffect(() => {
    return () => {
      // This will clear the timer if the component is
      //  closed before the timer runs out.
      if (closeTimer) {
        clearTimeout(closeTimer);
      }
    };
  }, []);

  const onDeletionSuccess = () => {
    setDeleted(true);
    setCloseTimer(setTimeout(onClose, 3000));
  };

  return (
    <Modal
      onClose={onClose}
      headContent={
        <>{deleted ? <Icon.SuccessCheckmark /> : <Icon.WarningExclamation />}</>
      }
      bodyContent={
        <>
          <div className="deleteKeyModal">
            <div className="deleteKeyStatus">
              {deleted
                ? "Key Deleted Successfully!"
                : "Are you sure you want to delete this API Key?"}
            </div>
            <DeleteKeyActions
              apiKeyId={apiKeyId}
              usagePlanName={usagePlanName}
              onSuccess={onDeletionSuccess}
              onClose={onClose}
            />
          </div>
        </>
      }
    />
  );
}
