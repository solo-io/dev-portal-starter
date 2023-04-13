import { Button as MantineButton } from "@mantine/core";
import { useState } from "react";
import { APIKey } from "../../../Apis/api-types";
import { Icon } from "../../../Assets/Icons";
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
  wasRecentlyGenerated,
}: {
  apiKey: APIKey;
  usagePlanName: string;
  forceListRefetch: () => unknown | Promise<unknown>;
  wasRecentlyGenerated: boolean;
}) {
  const [seeDetailsModalOpen, setSeeDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  // const [showKey, setShowKey] = useState(false);

  return (
    <div className="apiKeyCardContainer">
      <div
        className={`apiKeyCard ${
          wasRecentlyGenerated ? "recentlyGenerated" : ""
        }`}
      >
        <div className="accessIcon">
          <Icon.Key />
          {apiKey.name ?? (apiKey.metadata as any).name ?? ""}
        </div>
        <div className="apiKeyKey">
          {/* 
        // TODO: Find what to display here.
        {showKey
          ? apiKey.id
          : "********************************************************"} */}
        </div>
        <div className="apiKeyActions">
          {/* <MantineButton
          variant="subtle"
          onClick={() => setShowKey(!showKey)}
          aria-label={"Toggle showing the API key"}
          title="Toggle showing the API key"
        >
          {showKey ? <Icon.Eye /> : <Icon.SlashedEye />}
        </MantineButton> */}
          <MantineButton
            variant="subtle"
            onClick={() => setSeeDetailsModalOpen(true)}
            aria-label={"See partial key details"}
            title="View key details"
          >
            <Icon.CircledPencil />
          </MantineButton>
          <MantineButton
            variant="subtle"
            onClick={openDeleteModal}
            aria-label={"Delete key"}
            title="Delete key"
          >
            <Icon.CircledX />
          </MantineButton>
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
      {wasRecentlyGenerated && (
        <div className="recentlyGeneratedText">Key Generated Successfully</div>
      )}
    </div>
  );
}
