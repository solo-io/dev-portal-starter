import { di } from "react-magnetic-di";
import { App } from "../../../../Apis/api-types";
import { useCreateClientIdMutation } from "../../../../Apis/gg_hooks";
import AddCredentialSubSection from "../CredentialsSection/AddCredentialSubSection";
import ClientIdDisplay from "../Modals/ClientIdDisplay";
import ViewCreatedItemModal from "../Modals/ViewCreatedItemModal";

const AddClientIdSubSection = ({
  open,
  onClose,
  app,
}: {
  open: boolean;
  onClose: () => void;
  app: App;
}) => {
  di(useCreateClientIdMutation);
  const { trigger: createClientId } = useCreateClientIdMutation(app.id);

  return (
    <AddCredentialSubSection
      kind="API Key with Client ID"
      open={open}
      onClose={onClose}
      create={(name: string) => createClientId({ name })}
      renderCreated={(created, onDone) => (
        <ViewCreatedItemModal
          createdObjectName="API Key with Client ID"
          itemToCopyName="API Key"
          itemToCopyValue={created?.apiKey ?? ""}
          open={!!created?.apiKey}
          onCloseModal={onDone}
          additionalContentTop={
            <ClientIdDisplay clientId={created?.clientId ?? ""} />
          }
        />
      )}
    />
  );
};

export default AddClientIdSubSection;
