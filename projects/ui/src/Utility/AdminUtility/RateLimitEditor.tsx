import { Box, Flex, NumberInput, Select, Text } from "@mantine/core";
import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { RateLimitUnit, rateLimitUnitOptions } from "../../Apis/api-types";
import {
  UpsertAppMetadataParams,
  UpsertSubscriptionMetadataParams,
  useUpsertAppMetadataMutation,
  useUpsertSubscriptionMetadataMutation,
} from "../../Apis/gg_hooks";
import { Button } from "../../Components/Common/Button";
import { useIsAdmin } from "../../Context/AuthContext";
import { colors } from "../../Styles";
import { shallowEquals } from "../utility";
import { SharedMetadataProps } from "./MetadataDisplay";

export type RateLimitEditorProps = SharedMetadataProps & {
  inAppDetailsPage: boolean;
  isSubscription: boolean;
  isEditingRateLimit: boolean;
  onIsEditingRateLimitChange: (newIsEditinRateLimit: boolean) => void;
};

export const RateLimitEditor = ({
  item,
  isEditingRateLimit,
  customMetadata,
  rateLimitInfo,
  onIsEditingRateLimitChange,
}: RateLimitEditorProps) => {
  //
  //  region State
  //
  const initialRateLimitInfo = rateLimitInfo ?? {
    // This is the default if no rate limit is specified.
    requestsPerUnit: "0",
    unit: RateLimitUnit[RateLimitUnit.UNKNOWN],
  };
  const rateLimitExists = !!rateLimitInfo;
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
  const { trigger: upsertAppMetadata } = useUpsertAppMetadataMutation();
  const { trigger: upsertSubscriptionMetadata } =
    useUpsertSubscriptionMetadataMutation();
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
        const payload: UpsertSubscriptionMetadataParams["arg"] = {
          customMetadata: newCustomMetadata,
          rateLimit: newRateLimitInfo,
          subscription: item,
        };
        // using the same upsert operation but in different contexts to better display the warning messages based on the context of the call
        if (!!item.metadata) {
          // Updating existing metadata
          await toast.promise(upsertSubscriptionMetadata(payload), {
            error: "There was an error updating the subscription metadata.",
            loading: "Updating the subscription metadata.",
            success: "Updated the subscription metadata!",
          });
        } else {
          // Creating metadata
          await toast.promise(upsertSubscriptionMetadata(payload), {
            error: "There was an error creating the subscription metadata.",
            loading: "Creating the subscription metadata.",
            success: "Created the subscription metadata!",
          });
        }
      } else {
        // This is an App
        const payload: UpsertAppMetadataParams["arg"] = {
          customMetadata: newCustomMetadata,
          rateLimit: newRateLimitInfo,
          appId: item.id,
        };
        if (!!item.metadata) {
          // Updating existing metadata
          await toast.promise(upsertAppMetadata(payload), {
            error: "There was an error updating the app metadata.",
            loading: "Updating the app metadata.",
            success: "Updated the app metadata!",
          });
        } else {
          // Creating metadata
          await toast.promise(upsertAppMetadata(payload), {
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
      {isAdmin && (
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
      )}

      {!rateLimitExists && !isEditingRateLimit ? (
        <Text size="sm" mt="10px" color={colors.septemberGrey}>
          No Rate Limit was found.
        </Text>
      ) : (
        <Box
          sx={{ paddingTop: isAdmin ? "12px" : "5px", paddingBottom: "5px" }}
        >
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
                  min={0}
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
                <Select
                  required
                  disabled={!isEditingRateLimit}
                  id="unit-input"
                  data={rateLimitUnitOptions}
                  onChange={(value: string | null) => {
                    if (!!value) {
                      setUnit(value);
                    }
                  }}
                  value={unit}
                  placeholder="Unit"
                  autoComplete="off"
                />
              </Flex>
            </Flex>
          </Flex>
        </Box>
      )}
    </form>
  );
};
