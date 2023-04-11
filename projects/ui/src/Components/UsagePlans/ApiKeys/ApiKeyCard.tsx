import { useState } from "react";
import { APIKey } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
import { Button } from "../../Common/Button";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { ApiKeyDetailsModal } from "./ApiKeyDetailsModal";
import { DeleteApiKeyModal } from "./DeleteApiKeyModal";

/**
 * MAIN COMPONENT
 **/
export function ApiKeyCard({
  apiKey,
  usagePlanName,
  forceListRefetch,
}: {
  apiKey: APIKey;
  usagePlanName: string;
  forceListRefetch: () => unknown | Promise<unknown>;
}) {
  const [seeDetailsModalOpen, setSeeDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const openDetailsModal = () => {
    setSeeDetailsModalOpen(true);
  };
  const closeDetailsModal = () => {
    setSeeDetailsModalOpen(false);
  };
  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    forceListRefetch();
  };

  return (
    <div className="apiKeyCard">
      <div className="content">
        <div className="accessIcon">
          <Icon.Key />
        </div>
        <div className="details">
          <div>
            <h4 className="title">{apiKey.id}</h4>
            <div className="description">
              {apiKey.name ?? (apiKey.metadata as any).name ?? ""}
            </div>
          </div>
        </div>
        <div>
          <Button
            onClick={openDetailsModal}
            aria-label={"See partial key details"}
            title="View key details"
          >
            View Details
          </Button>
          <Button
            onClick={openDeleteModal}
            aria-label={"Delete key"}
            title="Delete key"
          >
            Delete
          </Button>
        </div>
      </div>
      <ErrorBoundary fallback="There was an issue attempting that action for this key">
        {seeDetailsModalOpen && (
          <ApiKeyDetailsModal
            apiKey={apiKey}
            onClose={closeDetailsModal}
            usagePlanName={usagePlanName}
          />
        )}
        {deleteModalOpen && (
          <DeleteApiKeyModal
            apiKeyId={apiKey.id}
            usagePlanName={usagePlanName}
            onClose={closeDeleteModal}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}
