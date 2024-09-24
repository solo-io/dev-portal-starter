import { Box, Input } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { di } from "react-magnetic-di";
import { App } from "../../../../Apis/api-types";
import { useCreateApiKeyMutation } from "../../../../Apis/gg_hooks";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { Accordion } from "../../../Common/Accordion";
import { Button } from "../../../Common/Button";
import ViewCreatedItemModal from "../Modals/ViewCreatedItemModal";

const AddApiKeysSubSection = ({
  open,
  onClose,
  app,
}: {
  open: boolean;
  onClose: () => void;
  app: App;
}) => {
  di(useCreateApiKeyMutation);

  //
  // Form Fields
  //
  const [formAppName, setFormAppName] = useState("");

  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !open || !formAppName;
  useEffect(() => {
    // The form resets here when `open` changes.
    setFormAppName("");
  }, [open]);

  //
  // Form Submit
  //
  const [createdApiKey, setCreatedApiKey] = useState<string>("");
  const { trigger: createApiKey } = useCreateApiKeyMutation(app.id);
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
      return;
    }
    const res = await toast.promise(createApiKey({ apiKeyName: formAppName }), {
      error: "There was an error creating the API Key.",
      loading: "Creating the API Key...",
      success: "Created the API Key!",
    });
    onClose();
    setCreatedApiKey(res.apiKey);
  };

  //
  // Render
  //
  return (
    <>
      <Accordion open={open}>
        <Box pb={"5px"}>
          <DetailsPageStyles.AddItemForm ref={formRef} onSubmit={onSubmit}>
            <Input
              id="api-key-name-input"
              aria-label="api-key name"
              required
              placeholder="API Key Name"
              disabled={!open}
              autoComplete="off"
              value={formAppName}
              onChange={(e) => setFormAppName(e.target.value)}
            />
            <Button disabled={isFormDisabled} type={"submit"}>
              ADD API Key
            </Button>
          </DetailsPageStyles.AddItemForm>
        </Box>
      </Accordion>
      <ViewCreatedItemModal
        createdObjectName="API Key"
        itemToCopyName="API Key"
        itemToCopyValue={createdApiKey}
        open={!!createdApiKey}
        onCloseModal={() => setCreatedApiKey("")}
      />
    </>
  );
};

export default AddApiKeysSubSection;
