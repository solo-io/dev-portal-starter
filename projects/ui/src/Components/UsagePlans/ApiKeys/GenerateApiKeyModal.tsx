import { Alert, Button as MantineButton, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCreateKeyMutation } from "../../../Apis/hooks";
import { Icon } from "../../../Assets/Icons";
import { Button } from "../../Common/Button";
import { DataPairPill, KeyValuePair } from "../../Common/DataPairPill";
import { Loading } from "../../Common/Loading";
import { Modal } from "../../Common/Modal";

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
  const { trigger: createKey, isMutating } = useCreateKeyMutation();

  const attemptToCreate = async () => {
    if (!apiKeyName || !!attemptingCreate) return;
    setAttemptingCreate(true);
    const response = await createKey({ usagePlanName, apiKeyName });
    setKeyValue(response?.apiKey);
    onSuccess();
  };

  // Set attempting to create = false when finished creating the key.
  useEffect(() => {
    if (!attemptingCreate || !!isMutating) return;
    setAttemptingCreate(false);
  }, [attemptingCreate, isMutating]);

  return (
    <div>
      {!!keyValue ? (
        <div className="keyIdLine">
          <Alert
            variant="light"
            icon={<Icon.InfoExclamation />}
            title="Warning!"
            color="orange"
          >
            This key value will not be available later. Please copy and secure
            this value now.
          </Alert>
          <br />

          <MantineButton
            variant="subtle"
            onClick={() => {
              navigator.clipboard.writeText(keyValue);
              toast.success("Copied API key to clipboard");
            }}
          >
            <div className="keyId">{keyValue}</div>
            <Icon.PaperStack />
          </MantineButton>
        </div>
      ) : attemptingCreate ? (
        <Loading message="Generating key..." />
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
    if (
      possiblePairAlreadyInList ||
      !possiblePair.pairKey ||
      !possiblePair.value
    ) {
      return;
    }
    setMetadataPairs([...metadataPairs, { ...possiblePair }]);
    setPossiblePair({ pairKey: "", value: "" });
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

  return (
    <Modal
      onClose={onClose}
      headContent={
        <>{generated ? <Icon.SuccessCheckmark /> : <Icon.CircledKey />}</>
      }
      title={generated ? "Key Generated Successfully!" : "Generate a New Key"}
      bodyContent={
        <div className="generateKeyModal">
          {!generated && (
            <>
              <div className="inputLine">
                <TextInput
                  placeholder="API Key Name"
                  onChange={(e) => setApiKeyName(e.target.value)}
                  value={apiKeyName}
                  disabled={generated}
                />
              </div>
              <div
                className="planAccessCarveOut"
                aria-labelledby="planAccessLabel"
              >
                <label className="title" id="planAccessLabel">
                  Access to:
                </label>
                <div className="planName">{usagePlanName}</div>
              </div>
              <div
                className="customMetadata"
                aria-labelledby="customMetadataLabel"
              >
                <label className="title" id="customMetadataLabel">
                  Custom Meta Data
                </label>
                <div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (possiblePairAlreadyInList) return;
                      addKeyValuePair();
                    }}
                    className="pairHolder"
                  >
                    <div className="textHolder">
                      <TextInput
                        placeholder="Key"
                        onChange={alterPairKey}
                        value={possiblePair.pairKey}
                      />
                    </div>
                    <span>:</span>
                    <div className="textHolder">
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
                  </form>
                </div>
                <div className="metadataList dataPairPillList">
                  {metadataPairs.map((pair, idx) => (
                    <DataPairPill
                      key={idx}
                      {...pair}
                      onRemove={() => removePair(pair)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          <CreateKeyActions
            usagePlanName={usagePlanName}
            apiKeyName={apiKeyName}
            customMetadata={metadataPairs}
            onSuccess={() => setGenerated(true)}
            onClose={onClose}
          />
        </div>
      }
    />
  );
}
