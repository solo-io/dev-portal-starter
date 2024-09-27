import { Box } from "@mantine/core";
import { App } from "../../../../Apis/api-types";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { MetadataDisplay } from "../../../../Utility/AdminUtility/MetadataDisplay";
import { EmptyData } from "../../../Common/EmptyData";

const AppMetadataSection = ({ app }: { app: App }) => {
  //
  // region Render
  //
  return (
    <DetailsPageStyles.Section>
      <DetailsPageStyles.Title>Metadata</DetailsPageStyles.Title>
      <GridCardStyles.GridCard whiteBg wide>
        <Box px={"20px"} py={"25px"}>
          {!!app.metadata?.rateLimit ? (
            <MetadataDisplay
              item={app}
              customMetadata={app.metadata?.customMetadata}
              rateLimitInfo={app.metadata?.rateLimit}
            />
          ) : (
            <Box pt="10px">
              <EmptyData title="No App metadata was found." />
            </Box>
          )}
        </Box>
      </GridCardStyles.GridCard>
    </DetailsPageStyles.Section>
  );
};

export default AppMetadataSection;
