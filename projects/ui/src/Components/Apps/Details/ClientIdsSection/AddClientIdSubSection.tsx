import { Flex } from "@mantine/core";
import { di } from "react-magnetic-di";
import { App } from "../../../../Apis/api-types";
import { useCreateClientIdMutation } from "../../../../Apis/gg_hooks";
import AddCredentialSubSection from "../CredentialsSection/AddCredentialSubSection";
import ViewCreatedItemModal from "../Modals/ViewCreatedItemModal";

const AddClientIdSubSection = ({
  open,
  onClose,
  app,
}: {
  open: boolean;
  onClose: () => void;
  app: App;
}) => {
  di(useCreateClientIdMutation);
  const { trigger: createClientId } = useCreateClientIdMutation(app.id);

  return (
    <AddCredentialSubSection
      kind="API Key with Client ID"
      open={open}
      onClose={onClose}
      create={(name: string) => createClientId({ name })}
      renderCreated={(created, onDone) => (
        <ViewCreatedItemModal
          createdObjectName="API Key with Client ID"
          itemToCopyName="API Key"
          itemToCopyValue={created?.apiKey ?? ""}
          open={!!created?.apiKey}
          onCloseModal={onDone}
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
                {created?.clientId ?? ""}
              </Flex>
            </>
          }
        />
      )}
    />
  );
};

export default AddClientIdSubSection;
