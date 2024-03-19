import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { svgColorReplace } from "../../Styles/utils";

export namespace ApiProductDetailsPageStyles {
  export const ApiDetailsHeaderAddition = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  `;

  export const ApiDetailsExtraInfoLeftSection = styled.div(
    ({ theme }) => css`
      border-right: 1px solid ${theme.augustGrey};
      padding-right: 10px;
    `
  );

  export const ApiDetailsExtraInfo = styled.div(
    ({ theme }) => css`
      display: flex;
      align-items: center;
      font-size: 0.95rem;
      font-weight: 500;

      svg {
        width: 23px;
        height: 23px;
        margin-right: 8px;
      }
      ${svgColorReplace(theme.primary)}
    `
  );

  export const SwaggerViewToggleHolder = styled.div(
    ({ theme }) => css`
      display: block;
      margin-top: -15px;
      margin-bottom: 8px;
      text-align: right;
      span {
        color: ${theme.lakeBlue};
        font-size: 1rem;
      }
    `
  );
}
