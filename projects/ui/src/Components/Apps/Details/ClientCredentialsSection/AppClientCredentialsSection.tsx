import { di } from "react-magnetic-di";
import { App } from "../../../../Apis/api-types";
import {
  useDeleteClientCredentialMutation,
  useListClientCredentialsForApp,
} from "../../../../Apis/gg_hooks";
import { isNotFoundError } from "../../../../Apis/utility";
import CredentialsSection from "../CredentialsSection/CredentialsSection";
import AddClientCredentialsSubSection from "./AddClientCredentialsSubSection";

const AppClientCredentialsSection = ({ app }: { app: App }) => {
  di(useListClientCredentialsForApp, useDeleteClientCredentialMutation);
  const { data: clientCredentials, error } = useListClientCredentialsForApp(
    app.id
  );
  const { trigger: deleteClientCredential } =
    useDeleteClientCredentialMutation(app.id);

  // A portal server that does not offer client credentials has no route for
  // them, so there is nothing to show rather than something that failed.
  if (isNotFoundError(error)) {
    return null;
  }
  return (
    <CredentialsSection
      kind="Client Credential"
      credentials={clientCredentials}
      error={error}
      // The client ID is public; only the secret is hidden after creation.
      columns={[{ header: "Client ID", cell: (c) => c.clientId }]}
      deleteCredential={(credential) =>
        deleteClientCredential({ clientCredentialId: credential.id })
      }
      renderAddSubSection={(open, onClose) => (
        <AddClientCredentialsSubSection
          app={app}
          open={open}
          onClose={onClose}
        />
      )}
    />
  );
};

export default AppClientCredentialsSection;
