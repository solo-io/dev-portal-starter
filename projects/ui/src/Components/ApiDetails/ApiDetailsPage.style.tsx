import { css } from "@emotion/react";
import styled from "@emotion/styled";

export namespace ApiDetailsPageStyles {
  export const ApiDetailsHeaderAddition = styled.div(
    ({ theme }) => css`
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 18px;
      font-weight: 500;
      color: ${theme.defaultColoredText};
    `
  );

  export const ApiDetailsExtraInfo = styled.div(
    ({ theme }) => css`
      display: flex;
      align-items: center;
      margin-right: 25px;

      svg {
        width: 23px;
        height: 23px;
        margin-right: 8px;

        * {
          fill: ${theme.primary};
        }
      }
    `
  );

  export const SwaggerViewToggleHolder = styled.div(
    ({ theme }) => css`
      width: calc(100vw - 16px);
      max-width: 1920px;
      padding: 0px 30px 5px 0px;
      margin: 0 auto;
      display: block;
      text-align: right;
      button {
        color: ${theme.primary};
      }
    `
  );
}
