import { Theme, css } from "@emotion/react";
import styled from "@emotion/styled";
import { borderRadiusConstants } from "./constants";

export const makePrimaryTrimmedSmallWhiteContainerCSS = (theme: Theme) => css`
  display: inline-block;
  padding: 0 10px;
  border-radius: ${borderRadiusConstants.standard};

  border: 1px solid ${theme.primary};
  color: ${theme.primary};
  background-color: ${theme.background};
`;

export const PrimaryTrimmedSmallWhiteContainer = styled.div(({ theme }) =>
  makePrimaryTrimmedSmallWhiteContainerCSS(theme)
);
