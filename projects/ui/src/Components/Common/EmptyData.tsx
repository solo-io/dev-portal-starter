import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Box, Flex, Text } from "@mantine/core";

const StyledEmptyContentOuter = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    text-align: center;
    line-height: 2rem;
    background-color: ${theme.marchGrey};
    padding: 30px;
  `
);

/**
 *  This is typically used for Empty sections with more custom content.
 */
export const SimpleEmptyContent = (props: {
  children?: React.ReactNode;
  title?: React.ReactNode;
}) => {
  return (
    <StyledEmptyContentOuter>
      <Box sx={{ maxWidth: "800px" }}>
        {props.title && (
          <Box
            sx={{
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            {props.title}
          </Box>
        )}
        {props.children}
      </Box>
    </StyledEmptyContentOuter>
  );
};

/**
 *  This is typically used for Empty data for topics.
 */
export function EmptyData(
  props:
    | {
        topic: string;
        message?: string;
      }
    | {
        topicMessageOverride: React.ReactNode;
      }
) {
  return (
    <Flex justify={"center"}>
      <Text color="gray.6" italic>
        {"topicMessageOverride" in props ? (
          <>{props.topicMessageOverride}</>
        ) : (
          <>No {props.topic} results were found</>
        )}
      </Text>
      {"message" in props && !!props.message && (
        <Text color="gray.6" italic>
          {props.message}
        </Text>
      )}
    </Flex>
  );
}
