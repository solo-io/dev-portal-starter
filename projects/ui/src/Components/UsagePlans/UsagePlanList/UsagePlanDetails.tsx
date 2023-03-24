import { useState } from "react";
import { UsagePlan } from "../../../Apis/api-types";
import { Button } from "../../Common/Button";
import { APIKeysList } from "../ApiKeys/ApiKeysList";
import { GenerateApiKeyModal } from "../ApiKeys/GenerateApiKeyModal";

/**
 * MAIN COMPONENT
 **/
export function UsagePlanDetails({
  usagePlan,
  apiId,
}: {
  usagePlan: UsagePlan;
  apiId: string;
}) {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

  const openCreateKeyModal = () => {
    /* eslint-disable no-console */
    console.log("DO IT");
    /* eslint-enable no-console */
    setCreateModalIsOpen(true);
  };
  const closeCreateKeyModal = () => {
    setCreateModalIsOpen(false);
  };

  return (
    <div className="usagePlanDetails">
      <div className="planHeader">
        <div>
          <div className="planName">{usagePlan.name} Plan</div>
          <div className="planRate">
            ( {usagePlan.rateLimitPolicy.requestsPerUnit} Requests per{" "}
            <span className="timeUnit">{usagePlan.rateLimitPolicy.unit}</span> )
          </div>
        </div>

        <div>
          <Button
            onClick={openCreateKeyModal}
            className="paleButton smallButton"
          >
            + ADD KEY
          </Button>
        </div>
      </div>
      <APIKeysList
        apiId={apiId}
        usagePlan={usagePlan}
        openCreateKeyModal={openCreateKeyModal}
      />

      {createModalIsOpen && (
        <GenerateApiKeyModal
          usagePlanName={usagePlan.name}
          onClose={closeCreateKeyModal}
        />
      )}
    </div>
  );
}
