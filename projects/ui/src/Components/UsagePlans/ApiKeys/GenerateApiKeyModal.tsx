import { TextInput } from "@mantine/core";
import { APIKey } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
import { Modal } from "../../Common/Modal";
import { useEffect, useState } from "react";
import { Button } from "../../Common/Button";
import { Loading } from "../../Common/Loading";
import { fetchJson, restpointPrefix } from "../../../Apis/hooks";
import { DataPairPill, KeyValuePair } from "../../Common/DataPairPill";

function CreateKeyActions({
  apiKeyName,
  usagePlanName,
  customMetadata,
  onSuccess,
  onClose,
}: {
  apiKeyName: string;
  usagePlanName: string;
  customMetadata: KeyValuePair[];
  onSuccess: () => void;
  onClose: () => any;
}) {
  const [attemptingCreate, setAttemptingCreate] = useState(false);
  const [keyValue, setKeyValue] = useState<string | undefined>();
  /* We aren't giving full insights here, but are giving them a hint at
      whether it was successful *and* when the action is completed  */
  const [copySuccessful, setCopySuccessful] = useState<boolean | undefined>();

  const attemptToCreate = () => {
    if (!!apiKeyName && !attemptingCreate) {
      setAttemptingCreate(true);

      fetchJson<APIKey>(`${restpointPrefix}/api-keys`, {
        method: "POST",
        body: JSON.stringify({
          usagePlan: usagePlanName,
          apiId: apiKeyName,
          customMetadata,
        }),
      })
        .then((response) => {
          setKeyValue(response.apiKey);
          setAttemptingCreate(false);
        })
        .catch(() => setAttemptingCreate(false));
    }
  };

  const copyKeyToClipboard = () => {
    // This should not be able to hit this function
    //   anyway if keyValue doesn't exist
    if (!keyValue) {
      let success = false;

      navigator.clipboard
        .writeText(keyValue!)
        .then(() => (success = true))
        .catch(() => {
          // eslint-disable-next-line no-console
          console.error("Unable to copy.");
        });

      setCopySuccessful(success);
      // A basic settimeout is not desirable since they
      //  could leave the modal before the timer hits and
      //  then references get grumpy. But it's non-fatal
      //  and this is very straightforward for comprehension.
      setTimeout(() => {
        setCopySuccessful(undefined);
      }, 3000);
    }
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
              className={
                !!copySuccessful
                  ? "success"
                  : copySuccessful === undefined
                  ? ""
                  : "error"
              }
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
  const [possiblePair, setPossiblePair] = useState<KeyValuePair>({
    pairKey: "",
    value: "",
  });
  const [possiblePairAlreadyInList, setPossiblePairAlreadyInList] =
    useState(false);
  const [metadataPairs, setMetadataPairs] = useState<KeyValuePair[]>([]);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    setPossiblePairAlreadyInList(
      metadataPairs.some(
        (existingPair) =>
          existingPair.pairKey === possiblePair.pairKey &&
          existingPair.value === possiblePair.value
      )
    );
  }, [possiblePair.pairKey, possiblePair.value]);

  const alterPairKey = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = evt.target.value;
    setPossiblePair({
      pairKey: newKey,
      value: possiblePair.value,
    });
  };
  const alterKeyValuePair = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.target.value;
    setPossiblePair({
      pairKey: possiblePair.pairKey,
      value: newValue,
    });
  };

  const addKeyValuePair = () => {
    if (!possiblePairAlreadyInList) {
      setMetadataPairs([...metadataPairs, { ...possiblePair }]);

      setPossiblePair({ pairKey: "", value: "" });
    }
  };
  const removePair = (removedPair: KeyValuePair) => {
    setMetadataPairs(
      metadataPairs.filter(
        (oldPair) =>
          oldPair.pairKey !== removedPair.pairKey ||
          oldPair.value !== removedPair.value
      )
    );
  };

  const onGenerationSuccess = () => {
    setGenerated(true);
  };

  return (
    <Modal
      onClose={onClose}
      headContent={
        <>{generated ? <Icon.SuccessCheckmark /> : <Icon.CircledKey />}</>
      }
      title={generated ? "Key Generated Successfully!" : "Generate a New Key"}
      bodyContent={
        <div className="generateKeyModal">
          <div className="inputLine">
            <TextInput
              placeholder="API Key Name"
              onChange={(e) => setApiKeyName(e.target.value)}
              value={apiKeyName}
              disabled={generated}
            />
          </div>
          <div className="planAccessCarveOut" aria-labelledby="planAccessLabel">
            <label className="title" id="planAccessLabel">
              Access to:
            </label>
            <div className="planName">{usagePlanName}</div>
          </div>
          <div className="customMetadata" aria-labelledby="customMetadataLabel">
            <label className="title" id="customMetadataLabel">
              Custom Meta Data
            </label>
            <div>
              <div className="pairHolder">
                <TextInput
                  placeholder="Key"
                  onChange={alterPairKey}
                  value={possiblePair.pairKey}
                />
                <span>:</span>
                <TextInput
                  placeholder="Value"
                  onChange={alterKeyValuePair}
                  value={possiblePair.value}
                />
              </div>
              <div className="addButtonHolder">
                <button
                  aria-label="Add Pair "
                  onClick={addKeyValuePair}
                  disabled={possiblePairAlreadyInList}
                  title={
                    possiblePairAlreadyInList
                      ? "This pair is already in the list"
                      : undefined
                  }
                >
                  <Icon.Add />
                </button>
              </div>
            </div>
            <div className="metadataList dataPairPillList">
              {metadataPairs.map((pair) => (
                <DataPairPill {...pair} onRemove={() => removePair(pair)} />
              ))}
            </div>
          </div>
          <CreateKeyActions
            usagePlanName={usagePlanName}
            apiKeyName={apiKeyName}
            customMetadata={metadataPairs}
            onSuccess={onGenerationSuccess}
            onClose={onClose}
          />
        </div>
      }
    />
  );
}
