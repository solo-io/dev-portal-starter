import { di } from "react-magnetic-di";
import { App } from "../../../../Apis/api-types";
import {
  useDeleteApiKeyMutation,
  useListApiKeysForApp,
} from "../../../../Apis/gg_hooks";
import CredentialsSection from "../CredentialsSection/CredentialsSection";
import AddApiKeysSubSection from "./AddApiKeysSubSection";

const AppApiKeysSection = ({ app }: { app: App }) => {
  di(useListApiKeysForApp, useDeleteApiKeyMutation);
  const { data: apiKeys, error } = useListApiKeysForApp(app.id);
  const { trigger: deleteApiKey } = useDeleteApiKeyMutation(app.id);

  return (
    <CredentialsSection
      kind="API Key"
      credentials={apiKeys}
      error={error}
      deleteCredential={(apiKey) => deleteApiKey({ apiKeyId: apiKey.id })}
      renderAddSubSection={(open, onClose) => (
        <AddApiKeysSubSection app={app} open={open} onClose={onClose} />
      )}
    />
  );
};

export default AppApiKeysSection;
