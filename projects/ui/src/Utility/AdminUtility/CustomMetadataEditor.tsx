import { Box, Flex, Input, Text } from "@mantine/core";
import { FormEvent, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  UpsertAppMetadataParams,
  UpsertSubscriptionMetadataParams,
  useUpsertAppMetadataMutation,
  useUpsertSubscriptionMetadataMutation,
} from "../../Apis/gg_hooks";
import { Icon } from "../../Assets/Icons";
import { Button } from "../../Components/Common/Button";
import { DataPairPill } from "../../Components/Common/DataPairPill";
import { useIsAdmin } from "../../Context/AuthContext";
import { colors } from "../../Styles";
import { FilterStyles } from "../../Styles/shared/Filters.style";
import { shallowEquals } from "../utility";
import { SharedMetadataProps } from "./MetadataDisplay";

export const CustomMetadataEditor = ({
  item,
  isEditingCustomMetadata,
  customMetadata,
  rateLimitInfo,
  onIsEditingCustomMetadataChange,
}: SharedMetadataProps & {
  isEditingCustomMetadata: boolean;
  onIsEditingCustomMetadataChange: (newIsEditingMetadata: boolean) => void;
}) => {
  //
  //  region State
  //
  const formRef = useRef<HTMLFormElement>(null);
  const [metaKey, setMetaKey] = useState("");
  const [metaValue, setMetaValue] = useState("");
  const metaKeyInputRef = useRef<HTMLInputElement | null>(null);
  const isAdmin = useIsAdmin();

  const [editedCustomMetadata, setEditedCustomMetadata] = useState<
    Record<string, string>
  >(customMetadata ?? {});

  const editedCustomMetadataKeys = useMemo(
    () => Object.keys(editedCustomMetadata ?? {}),
    [editedCustomMetadata]
  );

  //
  //  region Saving Data
  //
  const { trigger: upsertAppMetadata } = useUpsertAppMetadataMutation();
  const { trigger: upsertSubscriptionMetadata } =
    useUpsertSubscriptionMetadataMutation();
  const onSave = async () => {
    // Stop here if the object wasn't edited.
    if (shallowEquals(editedCustomMetadata, customMetadata)) {
      return;
    }
    (async () => {
      if ("applicationId" in item) {
        // This is a Subscription
        const payload: UpsertSubscriptionMetadataParams["arg"] = {
          customMetadata: editedCustomMetadata,
          rateLimit: rateLimitInfo,
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
          customMetadata: editedCustomMetadata,
          rateLimit: rateLimitInfo,
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
      onIsEditingCustomMetadataChange(false);
    })();
  };

  //
  //  region Helpers
  //

  const addEditedMetadata = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || !metaKey || !metaValue) {
      return;
    }
    setEditedCustomMetadata({
      ...editedCustomMetadata,
      [metaKey]: metaValue,
    });
    setMetaKey("");
    setMetaValue("");
    metaKeyInputRef.current?.focus();
  };

  const cancelEditingMetadata = () => {
    setMetaKey("");
    setMetaValue("");
    setEditedCustomMetadata(customMetadata ?? {});
    onIsEditingCustomMetadataChange(false);
  };

  const beginEditingMetadata = () => onIsEditingCustomMetadataChange(true);

  //
  // region Render
  //
  return (
    <form ref={formRef} onSubmit={addEditedMetadata}>
      {/* 
      // region Edit/Save Buttons 
      */}
      {isAdmin ? (
        <Flex gap="10px">
          <Button
            type="button"
            color={isEditingCustomMetadata ? "secondary" : "primary"}
            size="xs"
            variant={isEditingCustomMetadata ? "filled" : "outline"}
            onClick={
              isEditingCustomMetadata
                ? cancelEditingMetadata
                : beginEditingMetadata
            }
          >
            {!isEditingCustomMetadata
              ? "Edit Custom Metadata"
              : "Cancel Editing Custom Metadata"}
          </Button>
          {isEditingCustomMetadata && (
            <Button size="xs" type="button" onClick={onSave}>
              Save
            </Button>
          )}
        </Flex>
      ) : (
        <Text size="lg" mb="10px">
          Custom Metadata
        </Text>
      )}

      {/* 
      // region Empty State 
      */}
      {!isAdmin && !editedCustomMetadataKeys.length && (
        <Text size="sm" mb="-5px" color={colors.septemberGrey}>
          No Custom Metadata was found.
        </Text>
      )}

      {/* 
      // region Metadata Pills 
      */}
      <Box
        sx={{
          paddingTop: isAdmin ? "15px" : "0px",
          paddingBottom: "10px",
        }}
      >
        {!!editedCustomMetadataKeys.length && (
          <Flex gap="5px" wrap="wrap">
            {editedCustomMetadataKeys.map((k) => (
              <DataPairPill
                key={k}
                pairKey={k}
                value={
                  <>
                    {editedCustomMetadata[k]}
                    {isEditingCustomMetadata && (
                      <FilterStyles.CloseFilterButton
                        aria-label={`Remove ${k} filter`}
                        type="button"
                        onClick={() =>
                          setEditedCustomMetadata(
                            Object.fromEntries(
                              Object.entries(editedCustomMetadata).filter(
                                ([key, _]) => key !== k
                              )
                            )
                          )
                        }
                      >
                        <Icon.SmallX />
                      </FilterStyles.CloseFilterButton>
                    )}
                  </>
                }
              />
            ))}
          </Flex>
        )}

        {/* 
        // region Text Inputs 
        */}
        {isEditingCustomMetadata && (
          <Box pt={!!editedCustomMetadataKeys.length ? "5px" : "0px"}>
            <Flex gap="10px">
              <Flex sx={{ flexBasis: "50%" }}>
                <Flex direction="column" sx={{ flexGrow: 1 }}>
                  <Text size="md">
                    <label htmlFor="meta-key-input">Key</label>
                  </Text>
                  <Input
                    required
                    ref={metaKeyInputRef}
                    id="meta-key-input"
                    placeholder="Metadata Key"
                    autoComplete="off"
                    value={metaKey}
                    onChange={(e) => setMetaKey(e.target.value)}
                  />
                </Flex>
              </Flex>

              <Flex sx={{ flexBasis: "50%", flexGrow: 1 }}>
                <Flex direction="column" sx={{ flexGrow: 1 }}>
                  <Text size="md">
                    <label htmlFor="meta-value-input">Value</label>
                  </Text>
                  <Input
                    required
                    id="meta-value-input"
                    placeholder="Metadata Value"
                    autoComplete="off"
                    value={metaValue}
                    onChange={(e) => setMetaValue(e.target.value)}
                  />
                </Flex>
              </Flex>
              <Flex direction="column" justify={"flex-end"}>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!metaValue || !metaKey}
                  type="submit"
                >
                  Add Metadata
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>
    </form>
  );
};
