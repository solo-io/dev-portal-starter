import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Box } from "@mantine/core";
import { borderRadiusConstants } from "../../Styles/constants";

const StyledEmptyContentOuter = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    text-align: center;
    line-height: 2rem;
    background-color: white;
    box-shadow: 1px 1px 5px ${theme.splashBlue};
    border: 1px solid ${theme.splashBlue};
    border-radius: ${borderRadiusConstants.small};
    margin-bottom: 30px;
    padding: 30px;
  `
);

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
          <Box sx={{ fontSize: "1rem", marginTop: "10px" }}>
            {props.children}
          </Box>
        )}
      </Box>
    </StyledEmptyContentOuter>
  );
};
