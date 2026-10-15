import { di } from "react-magnetic-di";
import { App } from "../../../../Apis/api-types";
import { useCreateApiKeyMutation } from "../../../../Apis/gg_hooks";
import AddCredentialSubSection from "../CredentialsSection/AddCredentialSubSection";
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
  const { trigger: createApiKey } = useCreateApiKeyMutation(app.id);

  return (
    <AddCredentialSubSection
      kind="API Key"
      open={open}
      onClose={onClose}
      create={(name: string) => createApiKey({ apiKeyName: name })}
      renderCreated={(created, onDone) => (
        <ViewCreatedItemModal
          createdObjectName="API Key"
          itemToCopyName="API Key"
          itemToCopyValue={created?.apiKey ?? ""}
          open={!!created?.apiKey}
          onCloseModal={onDone}
        />
      )}
    />
  );
};

export default AddApiKeysSubSection;
