import { Box, Flex, Input, NumberInput, Text } from "@mantine/core";
import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  CreateUpdateAppMetadataParams,
  CreateUpdateSubscriptionMetadataParams,
  useCreateAppMetadataMutation,
  useCreateSubscriptionMetadataMutation,
  useUpdateAppMetadataMutation,
  useUpdateSubscriptionMetadataMutation,
} from "../../Apis/gg_hooks";
import { Button } from "../../Components/Common/Button";
import { useIsAdmin } from "../../Context/AuthContext";
import { shallowEquals } from "../utility";
import { SharedMetadataProps } from "./MetadataDisplay";

export const RateLimitEditor = ({
  item,
  isEditingRateLimit,
  customMetadata,
  rateLimitInfo,
  onIsEditingRateLimitChange,
}: SharedMetadataProps & {
  isEditingRateLimit: boolean;
  onIsEditingRateLimitChange: (newIsEditinRateLimit: boolean) => void;
}) => {
  //
  //  region State
  //
  const initialRateLimitInfo = rateLimitInfo ?? {
    // This is the default if no rate limit is specified.
    requestsPerUnit: "0",
    unit: "UNKNOWN",
  };
  let initialRPU = 0;
  try {
    initialRPU = Number.parseInt(initialRateLimitInfo.requestsPerUnit ?? "0");
  } catch {}
  const formRef = useRef<HTMLFormElement>(null);
  const [requestsPerUnit, setRequestsPerUnit] = useState(initialRPU);
  const [unit, setUnit] = useState(initialRateLimitInfo.unit);
  const requestsPerUnitRef = useRef<HTMLInputElement | null>(null);
  const isAdmin = useIsAdmin();

  //
  //  region Saving Data
  //
  const { trigger: createAppMetadata } = useCreateAppMetadataMutation();
  const { trigger: updateAppMetadata } = useUpdateAppMetadataMutation();
  const { trigger: createSubscriptionMetadata } =
    useCreateSubscriptionMetadataMutation();
  const { trigger: updateSubscriptionMetadata } =
    useUpdateSubscriptionMetadataMutation();
  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    const newRateLimitInfo = {
      requestsPerUnit: requestsPerUnit.toString(),
      unit,
    };
    const newCustomMetadata = customMetadata ?? {};
    // Stop here if the object wasn't edited.
    if (shallowEquals(newRateLimitInfo, initialRateLimitInfo)) {
      return;
    }
    (async () => {
      if ("applicationId" in item) {
        // This is a Subscription
        const payload: CreateUpdateSubscriptionMetadataParams["arg"] = {
          customMetadata: newCustomMetadata,
          rateLimit: newRateLimitInfo,
          subscription: item,
        };
        if (!!item.metadata) {
          // Updating existing metadata
          await toast.promise(updateSubscriptionMetadata(payload), {
            error: "There was an error updating the subscription metadata.",
            loading: "Updating the subscription metadata.",
            success: "Updated the subscription metadata!",
          });
        } else {
          // Creating metadata
          await toast.promise(createSubscriptionMetadata(payload), {
            error: "There was an error creating the subscription metadata.",
            loading: "Creating the subscription metadata.",
            success: "Created the subscription metadata!",
          });
        }
      } else {
        // This is an App
        const payload: CreateUpdateAppMetadataParams["arg"] = {
          customMetadata: newCustomMetadata,
          rateLimit: newRateLimitInfo,
          appId: item.id,
        };
        if (!!item.metadata) {
          // Updating existing metadata
          await toast.promise(updateAppMetadata(payload), {
            error: "There was an error updating the app metadata.",
            loading: "Updating the app metadata.",
            success: "Updated the app metadata!",
          });
        } else {
          // Creating metadata
          await toast.promise(createAppMetadata(payload), {
            error: "There was an error updating the app metadata.",
            loading: "Creating the app metadata.",
            success: "Created the app metadata!",
          });
        }
      }
      onIsEditingRateLimitChange(false);
    })();
  };

  //
  //  region Helpers
  //

  const cancelEditingRateLimit = () => {
    setRequestsPerUnit(initialRPU);
    setUnit(initialRateLimitInfo.unit);
    onIsEditingRateLimitChange(false);
  };

  const beginEditingRateLimit = () => onIsEditingRateLimitChange(true);

  //
  // region Render
  //
  return (
    <form ref={formRef} onSubmit={onSave}>
      {/* 
      // region Edit/Save Buttons 
      */}
      {isAdmin ? (
        <Flex gap="10px">
          <Button
            type="button"
            color={isEditingRateLimit ? "secondary" : "primary"}
            size="xs"
            variant={isEditingRateLimit ? "filled" : "outline"}
            onClick={
              isEditingRateLimit
                ? cancelEditingRateLimit
                : beginEditingRateLimit
            }
          >
            {!isEditingRateLimit
              ? "Edit Rate Limit"
              : "Cancel Editing Rate Limit"}
          </Button>
          {isEditingRateLimit && (
            <Button size="xs" type="submit" onClick={onSave}>
              Save
            </Button>
          )}
        </Flex>
      ) : (
        <Text size="lg">Rate Limit</Text>
      )}

      <Box sx={{ paddingTop: isAdmin ? "15px" : "5px", paddingBottom: "5px" }}>
        {/* 
        // region Text Inputs 
        */}
        <Flex gap="10px">
          <Flex sx={{ flexBasis: "50%" }}>
            <Flex direction="column" sx={{ flexGrow: 1 }}>
              <Text size="md">
                <label htmlFor="rpu-input">Requests Per Unit</label>
              </Text>
              <NumberInput
                required
                type="number"
                disabled={!isEditingRateLimit}
                ref={requestsPerUnitRef}
                id="rpu-input"
                placeholder="Requests Per Unit"
                autoComplete="off"
                value={requestsPerUnit}
                onChange={(value) => {
                  setRequestsPerUnit(value === "" ? 0 : value);
                }}
              />
            </Flex>
          </Flex>

          <Flex sx={{ flexBasis: "50%", flexGrow: 1 }}>
            <Flex direction="column" sx={{ flexGrow: 1 }}>
              <Text size="md">
                <label htmlFor="unit-input">Unit</label>
              </Text>
              <Input
                required
                disabled={!isEditingRateLimit}
                id="unit-input"
                placeholder="Unit"
                autoComplete="off"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </form>
  );
};
