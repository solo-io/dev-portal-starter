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
          <div className="planAccessCarveOut" aria-labelledby="planAccessLabel">
            <label className="title" id="planAccessLabel">
              Access to:
            </label>
            <div className="planName">{usagePlanName}</div>
          </div>
          {!!apiKey.metadata && Object.keys(apiKey.metadata).length > 0 && (
            <div
              className="customMetadata"
              aria-labelledby="customMetadataLabel"
            >
              <label className="title" id="customMetadataLabel">
                Custom Metadata
              </label>
              <div className="metadataList dataPairPillList">
                {Object.entries(apiKey.metadata).map(([pairKey, pairValue]) => (
                  <DataPairPill
                    key={pairKey}
                    pairKey={pairKey}
                    value={pairValue}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
