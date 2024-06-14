import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Box } from "@mantine/core";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ApiVersion } from "../../../../Apis/api-types";
import { CardStyles } from "../../../../Styles/shared/Card.style";

const MarkdownOuterContainer = styled.div(
  ({ theme }) => css`
    padding: 30px;
    * {
      margin: revert;
      padding: revert;
      font-family: revert;
      font-weight: revert;
    }
    blockquote p {
      color: ${theme.augustGrey};
    }
  `
);

const DocsTabContent = ({
  selectedApiVersion,
}: {
  selectedApiVersion: ApiVersion;
}) => {
  return (
    <Box pb={"60px"}>
      <CardStyles.Card>
        <MarkdownOuterContainer>
          <Markdown remarkPlugins={[remarkGfm]}>
            {selectedApiVersion.documentation}
          </Markdown>
        </MarkdownOuterContainer>
      </CardStyles.Card>
    </Box>
  );
};

export default DocsTabContent;
