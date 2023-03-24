import { Input } from "antd";
import { APIKey } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
import { Modal } from "../../Common/Modal";
import { useState } from "react";
import { Button } from "../../Common/Button";
import { Loading } from "../../Common/Loading";
import { fetchJson, restpointPrefix } from "../../../Apis/hooks";

function CreateKeyActions({
  apiKeyName,
  usagePlanName,
  onSuccess,
  onClose,
}: {
  apiKeyName: string;
  usagePlanName: string;
  onSuccess: () => void;
  onClose: () => any;
}) {
  const [attemptingCreate, setAttemptingCreate] = useState(false);
  const [keyValue, setKeyValue] = useState();
  const [copySuccessful, setCopySuccessful] = useState();

  const attemptToCreate = () => {
    if (!!apiKeyName && !attemptingCreate) {
      setAttemptingCreate(true);

      fetchJson<APIKey>(`${restpointPrefix}/api-keys`, {
        method: "POST",
        body: JSON.stringify({ usagePlan: usagePlanName, apiId: apiKeyName }),
      })
        .then((response) => {
          setKeyValue(response);
          setAttemptingCreate(false);
        })
        .catch(() => setAttemptingCreate(false));
    }
  };

  const copyKeyToClipboard = () => {
    let textArea = document.createElement("textarea");

    textArea.style.position = "fixed";
    textArea.style.top = "-999px";
    textArea.style.left = "-999px";

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = "2em";
    textArea.style.height = "2em";

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = "rgba(255, 255, 255, 0)";

    textArea.value = keyValue;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let success = false;
    try {
      success = document.execCommand("copy");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Oops, unable to copy." + err);
    }

    document.body.removeChild(textArea);

    return success;
  };

  return (
    <div>
      {!!keyValue ? (
        <div>
          {keyValue}+Copy <Button onClick={onClose}>CLOSE WINDOW</Button>
        </div>
      ) : attemptingCreate ? (
        <Loading message="Generating key..." />
      ) : keyValue ? (
        <div className="generatedKeyHolder">
          <div className="warning">
            This key will not be viewable again. Please save it at this time.
          </div>
          <div className="generatedKey">
            {keyValue}{" "}
            <Button
              onClick={copyKeyToClipboard}
              aria-label="Copy key to clipboard"
              title="Copy key to clipboard"
            >
              <Icon.PaperStack />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={attemptToCreate}
          disabled={!apiKeyName}
          title={!apiKeyName ? "An API Key Name must be provided" : ""}
        >
          GENERATE KEY
        </Button>
      )}
    </div>
  );
}

export function GenerateApiKeyModal({
  usagePlanName,
  onClose,
}: {
  usagePlanName: string;
  onClose: () => any;
}) {
  const [apiKeyName, setApiKeyName] = useState("");
  const [generated, setGenerated] = useState(false);

  const onGenerationSuccess = () => {
    setGenerated(true);
  };

  return (
    <Modal
      onClose={onClose}
      headContent={generated ? <Icon.SuccessCheckmark /> : <Icon.CircledKey />}
      title={generated ? "Key Generated Successfully!" : "Generate a New Key"}
      bodyContent={
        <div className="generateKeyModal">
          <div className="inputLine">
            <Input
              placeholder="API Key Name"
              onChange={(e) => setApiKeyName(e.target.value)}
              value={apiKeyName}
              disabled={generated}
            />
          </div>
          <div className="planAccessCarveOut">
            <div className="title">Access to:</div>
            <div className="planName">{usagePlanName}</div>
          </div>
          <CreateKeyActions
            usagePlanName={usagePlanName}
            apiKeyName={apiKeyName}
            onSuccess={onGenerationSuccess}
            onClose={onClose}
          />
        </div>
      }
    />
  );
}
