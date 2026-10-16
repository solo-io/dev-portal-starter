import { Box, Flex } from "@mantine/core";
import { useState } from "react";
import { di } from "react-magnetic-di";
import { WebhookEndpoint } from "../../Apis/api-types";
import { useListWebhookEndpoints } from "../../Apis/gg_hooks";
import { isNotFoundError } from "../../Apis/utility";
import { GridCardStyles } from "../../Styles/shared/GridCard.style";
import { UtilityStyles } from "../../Styles/shared/Utility.style";
import { formatDateToMMDDYYYY } from "../../Utility/utility";
import { Button } from "../Common/Button";
import CustomPagination, {
  pageOptions,
  useCustomPagination,
} from "../Common/CustomPagination";
import { EmptyData } from "../Common/EmptyData";
import { Loading } from "../Common/Loading";
import Table from "../Common/Table";
import DeleteWebhookEndpointModal from "./Modals/DeleteWebhookEndpointModal";
import TestWebhookEndpointModal from "./Modals/TestWebhookEndpointModal";
import WebhookEndpointFormModal from "./Modals/WebhookEndpointFormModal";

export function WebhookEndpointsTable() {
  di(useListWebhookEndpoints);
  const { data: webhooks, error } = useListWebhookEndpoints();

  const customPaginationData = useCustomPagination(
    webhooks ?? [],
    pageOptions.table
  );
  const { paginatedData } = customPaginationData;

  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint>();
  const [deletingWebhook, setDeletingWebhook] = useState<WebhookEndpoint>();
  const [testingWebhook, setTestingWebhook] = useState<WebhookEndpoint>();

  //
  // Render
  //
  if (webhooks === undefined) {
    if (!error) {
      return <Loading message="Getting list of webhooks..." />;
    }
    // A portal server without webhook support has no route for them.
    if (isNotFoundError(error)) {
      return (
        <EmptyData title="This portal server does not support webhooks." />
      );
    }
    return (
      <EmptyData title="The webhooks could not be loaded.">
        {error instanceof Error ? error.message : undefined}
      </EmptyData>
    );
  }
  if (!webhooks.length) {
    return <EmptyData title="No webhooks were found." />;
  }
  return (
    <Box mb="30px">
      <GridCardStyles.GridCard whiteBg wide>
        <Box p={"20px"}>
          <Table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Status</th>
                <th>Created</th>
                <th>
                  <UtilityStyles.CenteredCellContent>
                    Actions
                  </UtilityStyles.CenteredCellContent>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((webhook) => (
                <tr key={webhook.id}>
                  <td style={{ wordBreak: "break-all" }}>{webhook.url}</td>
                  <td>{webhook.enabled ? "Enabled" : "Disabled"}</td>
                  <td>{formatDateToMMDDYYYY(new Date(webhook.createdAt))}</td>
                  <td>
                    <Flex justify={"center"} gap={"10px"}>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => setTestingWebhook(webhook)}
                      >
                        Test
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => setEditingWebhook(webhook)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        color="danger"
                        onClick={() => setDeletingWebhook(webhook)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>
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
      <WebhookEndpointFormModal
        open={!!editingWebhook}
        webhook={editingWebhook}
        onClose={() => setEditingWebhook(undefined)}
      />
      <DeleteWebhookEndpointModal
        webhook={deletingWebhook}
        onClose={() => setDeletingWebhook(undefined)}
      />
      <TestWebhookEndpointModal
        webhook={testingWebhook}
        onClose={() => setTestingWebhook(undefined)}
      />
    </Box>
  );
}
