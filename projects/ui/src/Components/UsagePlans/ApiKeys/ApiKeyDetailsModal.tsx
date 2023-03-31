import { APIKey } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
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
          <div className="planAccessCarveOut">
            <div className="title">Access to:</div>
            <div className="planName">{usagePlanName}</div>
          </div>
        </div>
      }
    />
  );
}
