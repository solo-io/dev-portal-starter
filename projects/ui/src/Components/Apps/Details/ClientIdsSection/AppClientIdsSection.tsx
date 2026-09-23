import { di } from "react-magnetic-di";
import { App } from "../../../../Apis/api-types";
import {
  useDeleteClientIdMutation,
  useListClientIdsForApp,
} from "../../../../Apis/gg_hooks";
import CredentialsSection from "../CredentialsSection/CredentialsSection";
import AddClientIdSubSection from "./AddClientIdSubSection";

/**
 * Lists the app's API keys with a client ID. These are a separate section from
 * standard API keys, not an optional field on them: a consumer is given one
 * kind or the other, and each needs every one of its fields.
 */
const AppClientIdsSection = ({ app }: { app: App }) => {
  di(useListClientIdsForApp, useDeleteClientIdMutation);
  const { data: clientIds, error } = useListClientIdsForApp(app.id);
  const { trigger: deleteClientId } = useDeleteClientIdMutation(app.id);

  return (
    <CredentialsSection
      kind="API Key with Client ID"
      kindPlural="API Keys with Client ID"
      credentials={clientIds}
      error={error}
      // The client ID is public; only the API key is hidden after creation.
      columns={[{ header: "Client ID", cell: (c) => c.clientId }]}
      deleteCredential={(clientId) =>
        deleteClientId({ clientIdId: clientId.id })
      }
      renderAddSubSection={(open, onClose) => (
        <AddClientIdSubSection app={app} open={open} onClose={onClose} />
      )}
    />
  );
};

export default AppClientIdsSection;
