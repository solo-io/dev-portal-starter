import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { makePrimaryTrimmedSmallWhiteContainerCSS } from "../PrimaryTrimmedSmallWhiteContainer";
import { borderRadiusConstants } from "../constants";

// TODO: Consolidate styles from ./GridCard.style.tsx and ListCard.style.tsx here, refactor, and reduce the amount of styles.
export namespace CardStyles {
  export const Card = styled.div(
    ({ theme }) => css`
      border: 1px solid ${theme.splashBlue};
      border-radius: ${borderRadiusConstants.small};
      background-color: white;
      box-shadow: 1px 1px 5px ${theme.splashBlue};
    `
  );

  export const TitleLarge = styled.div`
    line-height: 30px;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
  `;

  export const TitleMedium = styled.div<{ bold?: boolean }>(
    ({ bold }) => css`
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 2px;
      ${bold
        ? css`
            font-weight: 500;
          `
        : ""}
    `
  );

  export const TitleSmall = styled.div<{ bold?: boolean }>(
    ({ bold }) => css`
      font-size: 1.25rem;
      margin-bottom: 2px;
      text-align: left;
      ${bold
        ? css`
            font-weight: 500;
          `
        : ""}
    `
  );

  export const Description = styled.div(
    ({ theme }) => css`
      text-align: left;
      color: ${theme.septemberGrey};
      font-size: 1rem;
      margin-bottom: 10px;
    `
  );

  export const SmallerText = styled.span`
    font-size: 1rem;
  `;

  export const SecondaryInfo = styled.div(
    ({ theme }) => css`
      ${makePrimaryTrimmedSmallWhiteContainerCSS(theme)}
      font-size: 16px;
      line-height: 22px;
    `
  );

  export const MetaInfo = styled.div(
    ({ theme }) => css`
      display: flex;
      align-items: center;

      svg {
        margin-right: 10px;
        width: 20px;
        height: 20px;

        * {
          fill: ${theme.primary};
        }
      }
    `
  );
}
