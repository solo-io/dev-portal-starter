import { Box } from "@mantine/core";
import { App } from "../../../../Apis/api-types";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { DataPairPill } from "../../../Common/DataPairPill";

const AppAuthenticationSection = ({ app }: { app: App }) => {
  const hasOAuthClient =
    app.idpClientId && app.idpClientName && app.idpClientSecret;
  if (!hasOAuthClient) {
    return null;
  }
  return (
    <DetailsPageStyles.Section>
      <DetailsPageStyles.Title>Authentication</DetailsPageStyles.Title>
      <GridCardStyles.GridCard whiteBg>
        <Box px={"20px"} py={"25px"}>
          <DetailsPageStyles.CardTitleSmall>
            OAuth Client
          </DetailsPageStyles.CardTitleSmall>
          <DetailsPageStyles.OAuthClientRow>
            <span>Client ID:</span>
            <DetailsPageStyles.OAuthClientId>
              {app.idpClientId}
            </DetailsPageStyles.OAuthClientId>
            <DataPairPill pairKey={"Client Secret"} value={"hidden"} />
          </DetailsPageStyles.OAuthClientRow>
        </Box>
      </GridCardStyles.GridCard>
    </DetailsPageStyles.Section>
  );
};

export default AppAuthenticationSection;
