import { APIKey } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
import { DataPairPill } from "../../Common/DataPairPill";
import { Modal } from "../../Common/Modal";

export function ApiKeyDetailsModal({
  apiKey,
  usagePlanName,
  onClose,
}: {
  apiKey: APIKey;
  usagePlanName: string;
  onClose: () => any;
}) {
  return (
    <Modal
      onClose={onClose}
      headContent={<Icon.CircledKey />}
      title={"Key Details"}
      bodyContent={
        <div className="keyDetailsModal">
          <div className="keyIdLine">{apiKey.apiId}</div>
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
            <div className="metadataList dataPairPillList">
              {Object.keys(apiKey.customMetadata).map((customMetaKey) => (
                <DataPairPill
                  label={customMetaKey}
                  value={apiKey.customMetadata[customMetaKey]}
                />
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}
