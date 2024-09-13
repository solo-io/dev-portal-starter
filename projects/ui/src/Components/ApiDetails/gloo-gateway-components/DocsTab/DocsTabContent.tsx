import { Box } from "@mantine/core";
import { ApiVersion } from "../../../../Apis/api-types";
import { CardStyles } from "../../../../Styles/shared/Card.style";
import MarkdownRenderer from "../../../Common/MarkdownRenderer";

const DocsTabContent = ({
  selectedApiVersion,
}: {
  selectedApiVersion: ApiVersion;
}) => {
  return (
    <Box pb={"60px"}>
      <CardStyles.Card>
        <MarkdownRenderer markdown={selectedApiVersion.documentation} />
      </CardStyles.Card>
    </Box>
  );
};

export default DocsTabContent;
