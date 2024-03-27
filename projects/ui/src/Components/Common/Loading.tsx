import { Box, Flex, Loader, Text } from "@mantine/core";
import { colors } from "../../Styles";

export function Loading({
  message,
  small,
}: {
  message?: string;
  small?: boolean;
}) {
  return (
    <Box p={small ? "5px" : "10px"}>
      <Flex align="center" justify="center" direction="column" gap="20px">
        <Loader size={small ? "20px" : "50px"} color={colors.seaBlue} />
        {!!message && <Text color={colors.augustGrey}>{message}</Text>}
      </Flex>
    </Box>
  );
}
