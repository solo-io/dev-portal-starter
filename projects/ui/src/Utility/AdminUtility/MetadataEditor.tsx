import { Flex, Input, Text } from "@mantine/core";
import { FormEvent, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  CreateUpdateAppMetadataParams,
  CreateUpdateSubscriptionMetadataParams,
  useCreateAppMetadataMutation,
  useCreateSubscriptionMetadataMutation,
  useUpdateAppMetadataMutation,
  useUpdateSubscriptionMetadataMutation,
} from "../../Apis/gg_hooks";
import { Icon } from "../../Assets/Icons";
import { Button } from "../../Components/Common/Button";
import { DataPairPill } from "../../Components/Common/DataPairPill";
import { FilterStyles } from "../../Styles/shared/Filters.style";
import { SharedMetadataProps } from "./MetadataDisplay";

export const MetadataEditor = ({
  item,
  customMetadata,
  //   rateLimitInfo,
  onClose,
}: SharedMetadataProps & { onClose: () => void }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [metaKey, setMetaKey] = useState("");
  const [metaValue, setMetaValue] = useState("");
  const metaKeyInputRef = useRef<HTMLInputElement | null>(null);

  //   const [editedRateLimit, setEditedRateLimit] = useState<RateLimit | undefined>(
  //     rateLimitInfo
  //   );

  const [editedCustomMetadata, setEditedCustomMetadata] = useState<
    Record<string, string>
  >(customMetadata ?? {});

  const editedCustomMetadataKeys = useMemo(
    () => Object.keys(editedCustomMetadata ?? {}),
    [editedCustomMetadata]
  );

  // TODO: metadata is not being returned from /.../apps, or /app/123123... details.
  //   const { data: app } = useGetAppDetails(item.id);
  //   console.log(app);

  //
  //  Apply Changes
  //
  const { trigger: createAppMetadata } = useCreateAppMetadataMutation();
  const { trigger: updateAppMetadata } = useUpdateAppMetadataMutation();
  const { trigger: createSubscriptionMetadata } =
    useCreateSubscriptionMetadataMutation();
  const { trigger: updateSubscriptionMetadata } =
    useUpdateSubscriptionMetadataMutation();
  const onSave = async () => {
    // TODO: CHECK IF METADATA OBJECT CHANGED here

    (async () => {
      if ("applicationId" in item) {
        // This is a Subscription
        const payload: CreateUpdateSubscriptionMetadataParams["arg"] = {
          customMetadata: editedCustomMetadata,
          //   rateLimit: editedRateLimit,
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
          customMetadata: editedCustomMetadata,
          //   rateLimit: editedRateLimit,
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
      onClose();
    })();
  };

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

  return (
    <form ref={formRef} onSubmit={addEditedMetadata}>
      <Text size="lg" mb="5px">
        Edit Metadata
      </Text>

      <Flex gap="5px" mb="5px" wrap="wrap">
        {editedCustomMetadataKeys.map((k) => (
          <DataPairPill
            key={k}
            pairKey={k}
            value={
              <>
                {editedCustomMetadata[k]}
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
              </>
            }
          />
        ))}
      </Flex>

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

      <Flex justify={"flex-end"} mt="20px" gap="10px">
        <Button size="sm" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          // TODO: Update disabled
          // disabled={}
          onClick={onSave}
        >
          Save
        </Button>
      </Flex>
    </form>
  );
};
