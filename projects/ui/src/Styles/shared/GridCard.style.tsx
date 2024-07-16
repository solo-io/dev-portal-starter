import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { mediaQueryWithScreenSize } from "../breakpoints";
import { borderRadiusConstants } from "../constants";

export namespace GridCardStyles {
  export const ApiImageHolder = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    height: 225px;
    width: calc(100% + 2px);
    overflow: hidden;
    margin: -1px -1px 0;
    border-radius: ${`${borderRadiusConstants.small} ${borderRadiusConstants.small} 0 0`};
    margin-bottom: 20px;

    img {
      width: 100%;
      min-height: 100%;
    }
  `;

  export const GridCard = styled.div<{ whiteBg?: boolean; wide?: boolean }>(
    ({ theme, whiteBg, wide }) => css`
      display: flex;
      flex-direction: column;
      // This shows 3 API products per row.
      width: ${wide ? "unset" : "421px"};
      ${mediaQueryWithScreenSize.mediumAndSmaller} {
        flex-grow: 1;
      }

      height: 100%;
      border-radius: ${borderRadiusConstants.small};
      box-shadow: 1px 1px 5px ${theme.splashBlue};
      border: 1px solid ${theme.splashBlue};

      background: ${whiteBg ? "white" : theme.lightGreyTransparent};
      color: ${theme.defaultColoredText};
      text-align: center;
    `
  );

  export const Title = styled.div`
    line-height: 32px;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
    padding: 0 40px;
  `;

  export const Description = styled.div(
    ({ theme }) => css`
      color: ${theme.augustGrey};
      line-height: 22px;
      font-size: 16px;
      font-weight: 400;
      padding: 0 40px 5px;
      word-break: break-all;
    `
  );

  export const Footer = styled.div(
    ({ theme }) => css`
      display: flex;
      align-items: center;
      justify-content: center;

      height: 43px;
      border-radius: ${`0 0 ${borderRadiusConstants.small} ${borderRadiusConstants.small}`};
      background: ${theme.splashBlue};
    `
  );

  export const GridCardWithLink = styled(GridCard)(
    ({ theme }) => css`
      //
      // Shared styles between API summary cards
      //
      box-shadow: 1px 1px 5px ${theme.splashBlue};
      border: 1px solid ${theme.splashBlue};
      transition: 0.1s box-shadow, 0.1s outline-color;
      outline-offset: 2px;
      outline: 2px solid transparent;
      &:hover {
        outline-color: ${theme.lakeBlue};
        outline-width: 2px;
      }
      &:active {
        outline-color: ${theme.pondBlue};
        box-shadow: 0 0 5px ${theme.pondBlue};
        outline-width: 2px;
      }
    `
  ).withComponent(NavLink);
}
