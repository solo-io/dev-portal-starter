import { Alert, Button as MantineButton, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { APIKey } from "../../../Apis/api-types";
import { useCreateKeyMutation } from "../../../Apis/hooks";
import { Icon } from "../../../Assets/Icons";
import { copyToClipboard } from "../../../Utility/utility";
import { Button } from "../../Common/Button";
import { Modal } from "../../Common/Modal";

function CreateKeyActions({
  apiKeyName,
  usagePlanName,
  // customMetadata,
  // onClose,
  onSuccess,
  hasCopiedKey,
  onCopiedKey,
}: {
  apiKeyName: string;
  usagePlanName: string;
  // customMetadata: KeyValuePair[];
  onSuccess: (apiKey: APIKey | undefined) => void;
  onClose: () => any;
  hasCopiedKey: boolean;
  onCopiedKey: () => void;
}) {
  const [attemptingCreate, setAttemptingCreate] = useState(false);
  const [keyValue, setKeyValue] = useState<string | undefined>();
  const { trigger: createKey, isMutating } = useCreateKeyMutation();

  const attemptToCreate = async () => {
    if (!apiKeyName || !!attemptingCreate) return;
    setAttemptingCreate(true);
    const response = await toast.promise(
      createKey({ usagePlanName, apiKeyName }),
      {
        loading: "Creating the API key...",
        success: "API key created!",
        error: "There was an error creating the API key.",
      }
    );
    setKeyValue(response?.apiKey);
    onSuccess(response);
  };

  // Set attempting to create = false when finished creating the key.
  useEffect(() => {
    if (!attemptingCreate || !!isMutating) return;
    setAttemptingCreate(false);
  }, [attemptingCreate, isMutating]);

  return (
    <div>
      {!!keyValue ? (
        <>
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
          <div className="keyIdLine">
            <MantineButton
              variant="subtle"
              aria-label="Copy this API key"
              onClick={() => {
                copyToClipboard(keyValue)
                  .then(() => {
                    toast.success("Copied API key to clipboard");
                  })
                  .finally(onCopiedKey);
              }}
            >
              <div className="keyId">{keyValue}</div>
              {hasCopiedKey ? <Icon.SlashedCopy /> : <Icon.Copy />}
            </MantineButton>
          </div>
        </>
      ) : (
        <Button
          onClick={attemptToCreate}
          disabled={!apiKeyName || attemptingCreate}
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
  onKeyGenerated,
}: {
  usagePlanName: string;
  onClose: () => any;
  onKeyGenerated: (apiKey: APIKey | undefined) => void;
}) {
  const [apiKeyName, setApiKeyName] = useState("");
  const [generated, setGenerated] = useState(false);
  // TODO: Enable this when the backend supports custom metadata.
  /*
  const [possiblePair, setPossiblePair] = useState<KeyValuePair>({
    pairKey: "",
    value: "",
  });
  const [possiblePairAlreadyInList, setPossiblePairAlreadyInList] =
    useState(false);
  const [metadataPairs, setMetadataPairs] = useState<KeyValuePair[]>([]);

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
  */

  const [hasCopiedKey, setHasCopiedKey] = useState(false);

  return (
    <Modal
      className="generateKeyModalRoot"
      onClose={() => {
        // If we have generated and not copied the API key,
        // prevent the user from closing the modal.
        if (generated && !hasCopiedKey) {
          toast("Click the API key to copy it before closing the modal.");
          return;
        }
        onClose();
      }}
      headContent={
        <>{generated ? <Icon.SuccessCheckmark /> : <Icon.CircledKey />}</>
      }
      title={generated ? "Key Generated Successfully!" : "Generate a New Key"}
      bodyContent={
        <div className="generateKeyModalBody">
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
                {/* 
                // Can add usage plan description styles here.
                <div className="planDescription"></div> 
                */}
                <div className="planName">{usagePlanName} Plan</div>
              </div>
              {/* 
              // TODO: Enable this when the backend supports custom metadata.
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
              */}
            </>
          )}
          <CreateKeyActions
            usagePlanName={usagePlanName}
            apiKeyName={apiKeyName}
            // customMetadata={metadataPairs}
            onSuccess={(key) => {
              setGenerated(true);
              onKeyGenerated(key);
            }}
            hasCopiedKey={hasCopiedKey}
            onCopiedKey={() => setHasCopiedKey(true)}
            onClose={onClose}
          />
        </div>
      }
    />
  );
}
