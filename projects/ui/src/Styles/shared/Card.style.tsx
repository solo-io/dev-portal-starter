import { css } from "@emotion/react";
import styled from "@emotion/styled";

// TODO: Consolidate styles from ./GridCard.style.tsx and ListCard.style.tsx here, refactor, and reduce the amount of styles.
export namespace CardStyles {
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
    font-size: 0.95rem;
  `;
}
