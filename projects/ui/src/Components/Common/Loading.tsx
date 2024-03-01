import { Box, Flex, Loader, Text } from "@mantine/core";
import { colors } from "../../Styles";

export function Loading({ message }: { message?: string }) {
  return (
    <Box p={"10px"}>
      <Flex align="center" justify="center" direction="column" gap="20px">
        <Loader size={"50px"} color={colors.seaBlue} />
        {!!message && <Text color={colors.augustGrey}>{message}</Text>}
      </Flex>
    </Box>
  );
}
