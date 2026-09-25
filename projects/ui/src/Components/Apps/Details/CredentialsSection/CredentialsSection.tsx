import { Box, Flex } from "@mantine/core";
import { ReactNode, useState } from "react";
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
import ConfirmDeleteCredentialModal from "../Modals/ConfirmDeleteCredentialModal";

type NamedCredential = { id: string; name: string; createdAt: string };

/** A column shown between a credential's name and its creation date. */
export type CredentialColumn<T> = {
  header: string;
  cell: (credential: T) => ReactNode;
};

/**
 * An App details section that lists one kind of credential, with a form to add
 * one and a confirmation before deleting one.
 */
function CredentialsSection<T extends NamedCredential>({
  kind,
  credentials,
  error,
  columns = [],
  deleteCredential,
  renderAddSubSection,
}: {
  /** The credential's singular, title-case name, such as "API Key". */
  kind: string;
  credentials: T[] | undefined;
  error: unknown;
  columns?: CredentialColumn<T>[];
  deleteCredential: (credential: T) => Promise<unknown>;
  renderAddSubSection: (open: boolean, onClose: () => void) => ReactNode;
}) {
  const [showAddSubSection, setShowAddSubSection] = useState(false);

  const customPaginationData = useCustomPagination(
    credentials ?? [],
    pageOptions.table
  );
  const { paginatedData } = customPaginationData;

  const [confirmDeleteCredential, setConfirmDeleteCredential] = useState<T>();

  if (credentials === undefined) {
    if (!error) {
      return <Loading />;
    }
    return (
      <DetailsPageStyles.Section>
        <DetailsPageStyles.Title>{kind}s</DetailsPageStyles.Title>
        <Box mb={"-30px"} mt={"10px"}>
          <EmptyData title={`The ${kind}s could not be loaded.`}>
            {error instanceof Error ? error.message : undefined}
          </EmptyData>
        </Box>
      </DetailsPageStyles.Section>
    );
  }
  return (
    <DetailsPageStyles.Section>
      <Flex justify={"space-between"}>
        <DetailsPageStyles.Title>{kind}s</DetailsPageStyles.Title>
        <ToggleAddButton
          topicUpperCase={kind.toUpperCase()}
          isAdding={showAddSubSection}
          toggleAdding={() => setShowAddSubSection(!showAddSubSection)}
        />
      </Flex>
      {renderAddSubSection(showAddSubSection, () =>
        setShowAddSubSection(false)
      )}
      {!credentials.length ? (
        <Box mb={"-30px"} mt={"10px"}>
          <EmptyData title={`No ${kind}s were found.`} />
        </Box>
      ) : (
        <Box pt={"5px"}>
          <GridCardStyles.GridCard whiteBg wide>
            <Box p={"20px"}>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    {columns.map((column) => (
                      <th key={column.header}>{column.header}</th>
                    ))}
                    <th>Created</th>
                    <th>
                      <UtilityStyles.CenteredCellContent>
                        Delete
                      </UtilityStyles.CenteredCellContent>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.map((credential) => (
                    <tr key={credential.id}>
                      <td>{credential.name}</td>
                      {columns.map((column) => (
                        <td key={column.header}>{column.cell(credential)}</td>
                      ))}
                      <td>
                        {formatDateToMMDDYYYY(new Date(credential.createdAt))}
                      </td>
                      <td>
                        <UtilityStyles.CenteredCellContent>
                          <Button
                            size="xs"
                            variant="light"
                            color="danger"
                            onClick={() =>
                              setConfirmDeleteCredential(credential)
                            }
                          >
                            Delete
                          </Button>
                        </UtilityStyles.CenteredCellContent>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={columns.length + 3}>
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
      <ConfirmDeleteCredentialModal
        kind={kind}
        open={!!confirmDeleteCredential}
        credentialName={confirmDeleteCredential?.name ?? ""}
        details={
          confirmDeleteCredential &&
          columns.length > 0 &&
          columns.map((column) => (
            <div key={column.header}>
              {column.header}: {column.cell(confirmDeleteCredential)}
            </div>
          ))
        }
        onConfirm={() => deleteCredential(confirmDeleteCredential!)}
        onClose={() => setConfirmDeleteCredential(undefined)}
      />
    </DetailsPageStyles.Section>
  );
}

export default CredentialsSection;
