import { Flex } from "@mantine/core";
import { di } from "react-magnetic-di";
import { App } from "../../../../Apis/api-types";
import { useCreateClientCredentialMutation } from "../../../../Apis/gg_hooks";
import AddCredentialSubSection from "../CredentialsSection/AddCredentialSubSection";
import ViewCreatedItemModal from "../Modals/ViewCreatedItemModal";

const AddClientCredentialsSubSection = ({
  open,
  onClose,
  app,
}: {
  open: boolean;
  onClose: () => void;
  app: App;
}) => {
  di(useCreateClientCredentialMutation);
  const { trigger: createClientCredential } =
    useCreateClientCredentialMutation(app.id);

  return (
    <AddCredentialSubSection
      kind="Client Credential"
      open={open}
      onClose={onClose}
      create={(name: string) => createClientCredential({ name })}
      renderCreated={(created, onDone) => (
        <ViewCreatedItemModal
          createdObjectName="Client Credential"
          itemToCopyName="Client Secret"
          itemToCopyValue={created?.clientSecret ?? ""}
          open={!!created?.clientSecret}
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

export default AddClientCredentialsSubSection;
