import { Box, Flex } from "@mantine/core";
import { useState } from "react";
import { App } from "../../../../Apis/api-types";
import { useGetOauthCredentialsForApp } from "../../../../Apis/gg_hooks";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { Button } from "../../../Common/Button";
import { DataPairPill } from "../../../Common/DataPairPill";
import { Loading } from "../../../Common/Loading";
import ConfirmCreateOAuthModal from "../Modals/ConfirmCreateOAuthModal";
import ConfirmDeleteOAuthModal from "../Modals/ConfirmDeleteOAuthModal";

const AppAuthenticationSection = ({ app }: { app: App }) => {
  const { data: oauthCredentials, error: oauthError } =
    useGetOauthCredentialsForApp(app.id);

  const [credentialIdToDelete, setCredentialIdToDelete] = useState("");

  const [showConfirmCreateCredentials, setShowConfirmCreateCredentials] =
    useState(false);
  // const { trigger: createCredentials } = useCreateOAuthMutation(app.id);

  return (
    <DetailsPageStyles.Section>
      <DetailsPageStyles.Title>Authentication</DetailsPageStyles.Title>
      <GridCardStyles.GridCard whiteBg wide>
        <Box px={"20px"} py={"25px"}>
          <DetailsPageStyles.CardTitleSmall>
            OAuth Client
          </DetailsPageStyles.CardTitleSmall>
          {!!oauthError ? (
            // <div>error: {JSON.stringify(oauthError)}</div>
            <DetailsPageStyles.OAuthClientRow mt="10px">
              <Button onClick={() => setShowConfirmCreateCredentials(true)}>
                Create OAuth Client
              </Button>
            </DetailsPageStyles.OAuthClientRow>
          ) : oauthCredentials === undefined ? (
            <DetailsPageStyles.OAuthClientRow>
              <Flex sx={{ width: "100%" }} justify={"center"}>
                <Loading />
              </Flex>
            </DetailsPageStyles.OAuthClientRow>
          ) : (
            <>
              <DetailsPageStyles.OAuthClientRow>
                <span>Client ID:</span>
                <DetailsPageStyles.OAuthClientId>
                  {oauthCredentials.idpClientId}
                </DetailsPageStyles.OAuthClientId>
                <DataPairPill
                  pairKey={"Client Secret"}
                  value={oauthCredentials.idpClientSecret ?? "hidden"}
                />
              </DetailsPageStyles.OAuthClientRow>
              <DetailsPageStyles.OAuthClientRow mt="10px">
                <Button
                  variant="outline"
                  color="danger"
                  onClick={() => setCredentialIdToDelete(oauthCredentials.id)}
                >
                  Delete OAuth Client
                </Button>
              </DetailsPageStyles.OAuthClientRow>
            </>
          )}
        </Box>
      </GridCardStyles.GridCard>
      <ConfirmCreateOAuthModal
        appId={app.id}
        onClose={() => setShowConfirmCreateCredentials(false)}
        open={showConfirmCreateCredentials}
      />
      <ConfirmDeleteOAuthModal
        credentialId={credentialIdToDelete}
        appId={app.id}
        onClose={() => setCredentialIdToDelete("")}
        open={credentialIdToDelete !== ""}
      />
    </DetailsPageStyles.Section>
  );
};

export default AppAuthenticationSection;
