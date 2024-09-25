import { Box, Text } from "@mantine/core";
import { App } from "../../../Apis/api-types";
import { colors } from "../../../Styles";
import { borderRadiusConstants } from "../../../Styles/constants";

const AppMetadataDisplay = ({ app }: { app: App }) => {
  return (
    <Box
      sx={{
        border: "1px solid " + colors.splashBlue,
        borderRadius: borderRadiusConstants.small,
      }}
      p="20px"
    >
      <Text size="md">Metadata for {app.name}</Text>
    </Box>
  );
};

export default AppMetadataDisplay;
