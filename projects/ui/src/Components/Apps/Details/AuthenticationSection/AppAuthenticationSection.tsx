import { Box, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { App, OauthCredential } from "../../../../Apis/api-types";
import { useGetOauthCredentialsForApp } from "../../../../Apis/gg_hooks";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { Button } from "../../../Common/Button";
import { DataPairPill } from "../../../Common/DataPairPill";
import { Loading } from "../../../Common/Loading";
import ConfirmCreateOAuthModal from "../Modals/ConfirmCreateOAuthModal";
import ConfirmDeleteOAuthModal from "../Modals/ConfirmDeleteOAuthModal";
import ViewCreatedItemModal from "../Modals/ViewCreatedItemModal";

const AppAuthenticationSection = ({ app }: { app: App }) => {
  const { data: fetchedClientCredentials, error: oauthError } =
    useGetOauthCredentialsForApp(app.id);

  const [credentialIdToDelete, setCredentialIdToDelete] = useState("");
  const [showConfirmCreateCredentials, setShowConfirmCreateCredentials] =
    useState(false);

  // We split out the `credentialsToShow` here from the `fetchedClientCredentials`
  // so that we can set it to the response when the client is created.
  const [credentialsToShow, setCredentialsToShow] = useState<
    OauthCredential | undefined
  >(undefined);

  useEffect(() => {
    if (fetchedClientCredentials === undefined) {
      return;
    }
    if (credentialsToShow === undefined) {
      setCredentialsToShow(fetchedClientCredentials);
    }
  }, [fetchedClientCredentials]);

  //
  // region Render
  //
  return (
    <DetailsPageStyles.Section>
      <DetailsPageStyles.Title>Authentication</DetailsPageStyles.Title>
      <GridCardStyles.GridCard whiteBg wide>
        <Box px={"20px"} py={"25px"}>
          <DetailsPageStyles.CardTitleSmall>
            OAuth Client
          </DetailsPageStyles.CardTitleSmall>
          {!!oauthError ? (
            <DetailsPageStyles.OAuthClientRow mt="10px">
              <Button onClick={() => setShowConfirmCreateCredentials(true)}>
                Create OAuth Client
              </Button>
            </DetailsPageStyles.OAuthClientRow>
          ) : credentialsToShow === undefined ? (
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
                  {credentialsToShow.idpClientId}
                </DetailsPageStyles.OAuthClientId>
                <DataPairPill pairKey={"Client Secret"} value={"hidden"} />
              </DetailsPageStyles.OAuthClientRow>
              <DetailsPageStyles.OAuthClientRow mt="10px">
                <Button
                  variant="outline"
                  color="danger"
                  onClick={() => setCredentialIdToDelete(credentialsToShow.id)}
                >
                  Delete OAuth Client
                </Button>
              </DetailsPageStyles.OAuthClientRow>
            </>
          )}
        </Box>
      </GridCardStyles.GridCard>
      {/*

      // region Modals
      */}
      <ConfirmCreateOAuthModal
        appId={app.id}
        onClose={() => setShowConfirmCreateCredentials(false)}
        onCreatedClient={(newCredentials) => {
          setCredentialsToShow(newCredentials);
        }}
        open={showConfirmCreateCredentials}
      />
      <ConfirmDeleteOAuthModal
        credentialId={credentialIdToDelete}
        appId={app.id}
        onClose={() => setCredentialIdToDelete("")}
        open={credentialIdToDelete !== ""}
      />
      <ViewCreatedItemModal
        createdObjectName="OAuth Client"
        itemToCopyName="Client Secret"
        itemToCopyValue={credentialsToShow?.idpClientSecret ?? ""}
        open={!!credentialsToShow?.idpClientSecret}
        onCloseModal={() => {
          if (credentialsToShow) {
            setCredentialsToShow({
              ...credentialsToShow,
              idpClientSecret: "",
            });
          }
        }}
        additionalContentTop={
          <>
            <Flex
              w="100%"
              justify={"center"}
              mb="15px"
              sx={{ fontSize: "1.25rem" }}
            >
              Client ID
            </Flex>
            <Flex
              w="100%"
              justify={"center"}
              mb="30px"
              sx={{ fontSize: "1.25rem" }}
            >
              {credentialsToShow?.idpClientId ?? ""}
            </Flex>
          </>
        }
      />
    </DetailsPageStyles.Section>
  );
};

export default AppAuthenticationSection;
