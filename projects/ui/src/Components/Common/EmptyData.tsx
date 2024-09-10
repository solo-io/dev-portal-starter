import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Box, Flex, Text } from "@mantine/core";
import { borderRadiusConstants } from "../../Styles/constants";

const StyledEmptyContentOuter = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    text-align: center;
    line-height: 2rem;
    /* background-color: ${theme.splashBlueLight7}; */
    background-color: white;
    box-shadow: 1px 1px 5px ${theme.splashBlue};
    border: 1px solid ${theme.splashBlue};
    border-radius: ${borderRadiusConstants.small};
    margin-bottom: 30px;
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
              fontWeight: 400,
              fontSize: "1.2rem",
            }}
          >
            {props.title}
          </Box>
        )}
        {!!props.children && (
          <Box sx={{ fontSize: "1rem", marginTop: "12px" }}>
            {props.children}
          </Box>
        )}
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
