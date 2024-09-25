import { Box, Text } from "@mantine/core";
import { App } from "../../../Apis/api-types";
import { useIsAdmin } from "../../../Context/AuthContext";
import { colors } from "../../../Styles";
import { borderRadiusConstants } from "../../../Styles/constants";

const AppMetadataDisplay = ({ app }: { app: App }) => {
  const isAdmin = useIsAdmin();

  if (!app.metadata && !isAdmin) {
    return null;
  }
  return (
    <Box
      sx={{
        border: "1px solid " + colors.splashBlueDark10,
        backgroundColor: colors.dropBlue,
        borderRadius: borderRadiusConstants.small,
      }}
      p="10px 15px"
      my="5px"
    >
      {!app.metadata ? (
        <>
          <Text size="md" weight={500}>
            No Metadata
          </Text>
        </>
      ) : (
        <>
          <Text size="md" weight={500}>
            Metadata
          </Text>
          <Text size="sm">{JSON.stringify(app.metadata)}</Text>
        </>
      )}
    </Box>
  );
};

export default AppMetadataDisplay;
