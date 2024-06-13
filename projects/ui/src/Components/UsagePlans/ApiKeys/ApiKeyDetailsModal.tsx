import { APIKey } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
import { DataPairPill, DataPairPillList } from "../../Common/DataPairPill";
import { NotificationModal } from "../../Common/NotificationModal/NotificationModal";

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
    <NotificationModal
      onClose={onClose}
      headContent={<Icon.CircledKey />}
      title={"Key Details"}
      bodyContent={
        <div className="keyDetailsModalBody">
          <label className="keyName">{apiKey.name}</label>
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
                Custom Meta Data
              </label>
              <DataPairPillList className="metadataList">
                {Object.entries(apiKey.metadata).map(([pairKey, pairValue]) => (
                  <DataPairPill
                    key={pairKey}
                    pairKey={pairKey}
                    value={pairValue}
                  />
                ))}
              </DataPairPillList>
            </div>
          )}
        </div>
      }
    />
  );
}
