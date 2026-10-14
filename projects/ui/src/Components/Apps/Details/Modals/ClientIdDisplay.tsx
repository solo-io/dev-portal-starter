import { Flex } from "@mantine/core";

/** The client ID shown above the secret in a `ViewCreatedItemModal`. */
const ClientIdDisplay = ({ clientId }: { clientId: string }) => (
  <>
    <Flex w="100%" justify={"center"} mb="15px" sx={{ fontSize: "1.25rem" }}>
      Client ID
    </Flex>
    <Flex w="100%" justify={"center"} mb="30px" sx={{ fontSize: "1.25rem" }}>
      {clientId}
    </Flex>
  </>
);

export default ClientIdDisplay;
