import { APIKey } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
import { Modal } from "../../Common/Modal";
import { useEffect, useState } from "react";
import { Button } from "../../Common/Button";
import { Loading } from "../../Common/Loading";
import { fetchJson, restpointPrefix } from "../../../Apis/hooks";

function DeleteKeyActions({
  apiId,
  onSuccess,
  onClose,
}: {
  apiId: string;
  onSuccess: () => void;
  onClose: () => any;
}) {
  const [attemptingDelete, setAttemptingDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const attemptToDelete = () => {
    if (!attemptingDelete) {
      setAttemptingDelete(true);

      fetchJson<APIKey>(`${restpointPrefix}/api-keys/${apiId}`, {
        method: "DELETE",
      }).then((response) => {
        setDeleted(true);
        onSuccess();
      });
    }
  };

  return (
    <div>
      {attemptingCreate ? (
        <Loading message="Deleting key..." />
      ) : deleted ? null : (
        <>
          <Button onClick={attemptToDelete} title={"Confirm deleting this key"}>
            DELETE
          </Button>
          <Button
            className="paleButton"
            onClick={onClose}
            title={"Back out of this window without deleting"}
          >
            CANCEL
          </Button>
        </>
      )}
    </div>
  );
}

export function DeleteApiKeyModal({
  apiId,
  onClose,
}: {
  apiId: string;
  onClose: () => any;
}) {
  const [deleted, setDeleted] = useState(false);
  const [closeTimer, setCloseTimer] = useState();

  useEffect(() => {
    return () => {
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
        deleted ? <Icon.SuccessCheckmark /> : <Icon.WarningExclamation />
      }
      title={
        generated
          ? "Key Deleted Successfully!"
          : "Are you sure you want to remove this API Key?"
      }
      bodyContent={
        <div className="deleteKeyModal">
          <DeleteKeyActions
            apiId={apiId}
            onSuccess={onDeletionSuccess}
            onClose={onClose}
          />
        </div>
      }
    />
  );
}
