import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { borderRadiusConstants } from "../constants";

export namespace ListCardStyles {
  export const ApiImageHolder = styled.div(
    ({ theme }) => css`
      display: flex;
      padding: 2px;
      align-items: center;
      border-right: 1px solid ${theme.splashBlue};

      img {
        display: inline-block;
        width: auto;
        height: 200px;
        border-radius: ${borderRadiusConstants.xs};
        box-shadow: 0 0 2px ${theme.augustGrey};
      }
    `
  );

  export const MajorIconHolder = styled.div(
    ({ theme }) => css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 192px;
      border-right: 1px solid ${theme.splashBlue};

      svg {
        width: 100px;
        max-width: 95%;
        height: 100px;
        * {
          stroke: ${theme.primary};
          fill: ${theme.primary};
        }
      }
    `
  );

  export const Details = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 250px;
    min-height: 165px;
    padding: 20px;
  `;

  export const ListCardWithLink = styled.div(
    ({ theme }) => css`
      margin-bottom: 30px;
      border-radius: ${borderRadiusConstants.small};
      background: ${theme.lightGreyTransparent};

      //
      // Shared styles between API summary cards
      //
      box-shadow: 1px 1px 5px ${theme.splashBlue};
      border: 1px solid ${theme.splashBlue};
      transition:
        0.1s box-shadow,
        0.1s outline-color;
      outline-offset: 2px;
      outline: 2px solid transparent;
      &:hover {
        outline-color: ${theme.lakeBlue};
      }
      &:active {
        outline-color: ${theme.pondBlue};
        box-shadow: 0 0 5px ${theme.pondBlue};
      }
    `
  );

  export const Footer = styled.div(
    ({ theme }) => css`
      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 43px;
      padding: 0 15px 0 25px;
      border-radius: ${`0 0 ${borderRadiusConstants.small} ${borderRadiusConstants.small}`};
      background: ${theme.splashBlue};
    `
  );

  export const TypeIcon = styled.div(
    ({ theme }) => css`
      svg {
        width: 28px;
        height: 28px;

        * {
          fill: ${theme.primary};
        }
      }
    `
  );
}
