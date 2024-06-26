import { Box } from "@mantine/core";
import { App } from "../../../../Apis/api-types";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { DataPairPill } from "../../../Common/DataPairPill";

const AppAuthenticationSection = ({ app }: { app: App }) => {
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
            {/*
            // Designs show this "hidden" field, but we have the value.
            // TODO: Figure out what to show here.
            <DataPairPill pairKey={"Client Secret"} value={"hidden"} />
            */}
            <DataPairPill
              pairKey={"Client Secret"}
              value={app.idpClientSecret}
            />
          </DetailsPageStyles.OAuthClientRow>
        </Box>
      </GridCardStyles.GridCard>
    </DetailsPageStyles.Section>
  );
};

export default AppAuthenticationSection;
