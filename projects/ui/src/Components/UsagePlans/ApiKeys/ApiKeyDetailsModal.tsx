import { APIKey } from "../../../Apis/api-types";
import { useGetApiDetails } from "../../../Apis/hooks";
import { Icon } from "../../../Assets/Icons";
import { DataPairPill } from "../../Common/DataPairPill";
import { Loading } from "../../Common/Loading";
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
  const { isLoading, data: apiSchema } = useGetApiDetails(apiKey.apiId);

  return (
    <Modal
      onClose={onClose}
      headContent={<Icon.CircledKey />}
      title={"Key Details"}
      bodyContent={
        isLoading ? (
          <Loading message={`Retrieving schema for ${apiKey.apiId}...`} />
        ) : (
          <div className="keyDetailsModal">
            <div className="keyIdLine">{apiKey.apiId}</div>
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
              <div className="metadataList dataPairPillList">
                <DataPairPill label={"a label"} value={"a value"} />
              </div>
            </div>
          </div>
        )
      }
    />
  );
}
