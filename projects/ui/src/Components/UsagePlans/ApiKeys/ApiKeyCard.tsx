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
export function ApiKeyCard({ apiKey }: { apiKey: APIKey }) {
  const [keyIsHidden, setKeyIsHidden] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const toggleHidden = () => {
    setKeyIsHidden((isHidden) => !isHidden);
  };

  const openEditKeyModal = () => {
    setEditModalOpen(true);
  };
  const openDeleteKeyModal = () => {
    setDeleteModalOpen(true);
  };

  return (
    <div className="apiListCard">
      <div className="content">
        <div className="majorIconHolder">
          <Icon.Key />
        </div>
        <div className="details">
          <div>
            <h4 className="title">{apiKey.apiId}</h4>
            <div className="description">
              {keyIsHidden
                ? "********************************************************"
                : apiKey.apiKey}
            </div>
          </div>
        </div>
        <div>
          LIST OF ACTIONS{" "}
          <Button
            onClick={toggleHidden}
            aria-hidden="true"
            title={keyIsHidden ? "Show key text" : "Hide key text"}
          >
            {keyIsHidden ? <Icon.Eye /> : <Icon.SlashedEye />}
          </Button>
          <Button
            onClick={copyKeyToClipboard}
            aria-label={"Copy key text"}
            title="Copy key text"
          >
            <Icon.PaperStack />
          </Button>
          <Button
            onClick={openEditKeyModal}
            aria-label={"Edit key details"}
            title="Edit key"
          >
            <Icon.PaperStack />
          </Button>
          <Button
            onClick={openDeleteKeyModal}
            aria-label={"Delete key"}
            title="Delete key"
          >
            <Icon.PaperStack />
          </Button>
        </div>
      </div>
      <ErrorBoundary fallback="There was an issue loading the list of API Keys">
        {editModalOpen && <ApiKeyDetailsModal apiKey={apiKey} />}
        {deleteModalOpen && <DeleteApiKeyModal apiKey={apiKey} />}
      </ErrorBoundary>
    </div>
  );
}
