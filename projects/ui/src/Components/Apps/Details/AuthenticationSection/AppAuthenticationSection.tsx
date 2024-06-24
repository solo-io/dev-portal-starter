import { Box, Flex, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { App } from "../../../../Apis/api-types";
import { Icon } from "../../../../Assets/Icons";
import { colors } from "../../../../Styles";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { Button } from "../../../Common/Button";
import { DataPairPill } from "../../../Common/DataPairPill";
import CreateAppOauthCredentialsModal from "../../Modals/CreateAppOauthCredentialsModal";
import RevokeAppOauthCredentialsModal from "../../Modals/RevokeAppOauthCredentialsModal";
import RotateAppOauthCredentialsModal from "../../Modals/RotateAppOauthCredentialsModal";

export function generateSomeIdForDemo() {
  return Math.random().toString(36).slice(2, 18);
}

export type AppOauthCredentials = {
  oauthClientSecret: string;
  oauthClientId: string;
};

type AppOauthMap = Record<string, AppOauthCredentials>;

const LS_APP_OAUTH_MAP_KEY = "app-oauth-map";

const HorizLine = () => {
  return (
    <div
      style={{
        margin: "20px 0px",
        width: "100%",
        height: "1px",
        backgroundColor: colors.marchGrey,
      }}
    />
  );
};

const AppAuthenticationSection = ({ app }: { app: App }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [isRotateModalOpen, setIsRotateModalOpen] = useState(false);

  const appOauthMap: AppOauthMap = useMemo(() => {
    return JSON.parse(localStorage.getItem(LS_APP_OAUTH_MAP_KEY) ?? "{}");
  }, []);

  const [appOauthCredentials, setAppOauthCredentials] = useState<
    AppOauthCredentials | undefined
  >(appOauthMap[app.id]);

  useEffect(() => {
    localStorage.setItem(
      LS_APP_OAUTH_MAP_KEY,
      JSON.stringify({ ...appOauthMap, [app.id]: appOauthCredentials })
    );
  }, [app, appOauthCredentials, appOauthMap]);

  const noOAuthCredentials = appOauthCredentials === undefined;

  return (
    <DetailsPageStyles.Section>
      <DetailsPageStyles.Title>Authentication</DetailsPageStyles.Title>
      <GridCardStyles.GridCard whiteBg wide>
        <Box px={"20px"} py={"25px"}>
          <DetailsPageStyles.CardTitleSmall>
            Application OAuth Credentials
          </DetailsPageStyles.CardTitleSmall>

          <Flex
            sx={{ justifyContent: "flex-start", alignItems: "center" }}
            pt={15}
            gap={5}
            wrap="wrap"
          >
            {noOAuthCredentials ? (
              <Box w={"100%"} sx={{ textAlign: "left" }}>
                <DetailsPageStyles.OAuthClientRow>
                  <Text size={14} align="left" color={colors.secondary}>
                    No OAuth Credentials found.
                  </Text>
                </DetailsPageStyles.OAuthClientRow>
                <HorizLine />

                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="outline"
                  color="primary"
                  size="xs"
                >
                  <UtilityStyles.ButtonContentsWithIcon>
                    CREATE OAUTH CREDENTIALS
                    <Icon.Key width={18} style={{ marginTop: "-4px" }} />
                  </UtilityStyles.ButtonContentsWithIcon>
                </Button>
              </Box>
            ) : (
              <Box w={"100%"}>
                <DetailsPageStyles.OAuthClientRow>
                  <span>Client ID:</span>
                  <DetailsPageStyles.OAuthClientId>
                    {appOauthCredentials.oauthClientId}
                  </DetailsPageStyles.OAuthClientId>
                  <DataPairPill
                    pairKey={"Client Secret"}
                    value={appOauthCredentials.oauthClientSecret}
                  />
                </DetailsPageStyles.OAuthClientRow>
                <HorizLine />

                <Flex justify={"space-between"} align={"center"} gap={10}>
                  <Button
                    onClick={() => setIsRotateModalOpen(true)}
                    variant="outline"
                    color="primary"
                    size="xs"
                  >
                    <UtilityStyles.ButtonContentsWithIcon>
                      ROTATE OAUTH CREDENTIALS
                      <Icon.Refresh
                        width={14}
                        stroke={colors.lakeBlue}
                        style={{ marginTop: "-2px" }}
                      />
                    </UtilityStyles.ButtonContentsWithIcon>
                  </Button>
                  <Button
                    onClick={() => setIsRevokeModalOpen(true)}
                    variant="outline"
                    color="danger"
                    size="xs"
                  >
                    <UtilityStyles.ButtonContentsWithIcon color={colors.midRed}>
                      REVOKE OAUTH CREDENTIALS
                      <Icon.CircledX
                        width={18}
                        stroke={colors.midRed}
                        style={{ marginTop: "-2px" }}
                      />
                    </UtilityStyles.ButtonContentsWithIcon>
                  </Button>
                </Flex>
              </Box>
            )}
          </Flex>

          <CreateAppOauthCredentialsModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            app={app}
            onOauthCredentialsCreated={(newCredentials) => {
              setAppOauthCredentials(newCredentials);
            }}
          />
          <RotateAppOauthCredentialsModal
            open={isRotateModalOpen}
            onClose={() => setIsRotateModalOpen(false)}
            app={app}
            oauthClientId={appOauthCredentials?.oauthClientId ?? ""}
            onOauthCredentialsRotated={(newCredentials) => {
              setAppOauthCredentials(newCredentials);
            }}
          />
          <RevokeAppOauthCredentialsModal
            open={isRevokeModalOpen}
            onClose={() => setIsRevokeModalOpen(false)}
            app={app}
            onOauthCredentialsRevoked={() => {
              setAppOauthCredentials(undefined);
            }}
          />
        </Box>
      </GridCardStyles.GridCard>
    </DetailsPageStyles.Section>
  );
};

export default AppAuthenticationSection;
