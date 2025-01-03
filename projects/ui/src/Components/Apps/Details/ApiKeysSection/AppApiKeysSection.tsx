import { Box, Flex } from "@mantine/core";
import { useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { APIKey, App } from "../../../../Apis/api-types";
import { useListApiKeysForApp } from "../../../../Apis/gg_hooks";
import { useIsAdmin } from "../../../../Context/AuthContext";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { UtilityStyles } from "../../../../Styles/shared/Utility.style";
import { formatDateToMMDDYYYY } from "../../../../Utility/utility";
import { Button } from "../../../Common/Button";
import CustomPagination, {
  pageOptions,
  useCustomPagination,
} from "../../../Common/CustomPagination";
import { EmptyData } from "../../../Common/EmptyData";
import { Loading } from "../../../Common/Loading";
import Table from "../../../Common/Table";
import ToggleAddButton from "../../../Common/ToggleAddButton";
import ConfirmDeleteApiKeyModal from "../Modals/ConfirmDeleteApiKeyModal";
import AddApiKeysSubSection from "./AddApiKeysSubSection";

const AppApiKeysSection = ({ app }: { app: App }) => {
  di(useIsAdmin, useListApiKeysForApp);
  const isAdmin = useIsAdmin();
  const { data: apiKeys } = useListApiKeysForApp(app.id);
  const [showAddApiKeySubSection, setShowAddApiKeySubSection] = useState(false);

  const customPaginationData = useCustomPagination(
    apiKeys ?? [],
    pageOptions.table
  );
  const { paginatedData } = customPaginationData;

  const [confirmDeleteApiKey, setConfirmDeleteApiKey] = useState<APIKey>();

  const rows = useMemo(() => {
    return paginatedData?.map((apiKey) => {
      return (
        (
          <tr key={apiKey.id}>
            <td>{apiKey.name}</td>
            <td>{formatDateToMMDDYYYY(new Date(apiKey.createdAt))}</td>
            <td>
              <UtilityStyles.CenteredCellContent>
                <Button
                  size="xs"
                  variant="light"
                  color="danger"
                  onClick={() => setConfirmDeleteApiKey(apiKey)}
                >
                  Delete
                </Button>
              </UtilityStyles.CenteredCellContent>
            </td>
          </tr>
        ) ?? []
      );
    });
  }, [paginatedData]);

  if (apiKeys === undefined) {
    return <Loading />;
  }
  return (
    <DetailsPageStyles.Section>
      <Flex justify={"space-between"}>
        <DetailsPageStyles.Title>API Keys</DetailsPageStyles.Title>
        {!isAdmin && (
          <ToggleAddButton
            topicUpperCase="API KEY"
            isAdding={showAddApiKeySubSection}
            toggleAdding={() =>
              setShowAddApiKeySubSection(!showAddApiKeySubSection)
            }
          />
        )}
      </Flex>
      <AddApiKeysSubSection
        app={app}
        open={showAddApiKeySubSection}
        onClose={() => setShowAddApiKeySubSection(false)}
      />
      {!apiKeys?.length ? (
        <Box mb={"-30px"} mt={"10px"}>
          <EmptyData title="No API Keys were found." />
        </Box>
      ) : (
        <Box pt={"5px"}>
          <GridCardStyles.GridCard whiteBg wide>
            <Box p={"20px"}>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Created</th>
                    <th>
                      <UtilityStyles.CenteredCellContent>
                        Delete
                      </UtilityStyles.CenteredCellContent>
                    </th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot>
                  <tr>
                    <td colSpan={7}>
                      <Box p=".6rem">
                        <CustomPagination
                          customPaginationData={customPaginationData}
                        />
                      </Box>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Box>
          </GridCardStyles.GridCard>
        </Box>
      )}
      <ConfirmDeleteApiKeyModal
        open={!!confirmDeleteApiKey}
        apiKeyId={confirmDeleteApiKey?.id ?? ""}
        appId={app.id}
        onClose={() => setConfirmDeleteApiKey(undefined)}
      />
    </DetailsPageStyles.Section>
  );
};

export default AppApiKeysSection;
