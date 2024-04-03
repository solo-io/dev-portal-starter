import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Color } from "../utils";

export namespace UtilityStyles {
  export const ButtonContentsWithIcon = styled.div<{ color?: Color }>(
    ({ theme, color }) => css`
      display: flex;
      align-items: center;
      color: ${color ?? theme.lakeBlue};
      font-size: 0.8rem;
      gap: 10px;
    `
  );

  export const CenteredCellContent = styled.span`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  export const NavLinkContainer = styled.div(
    ({ theme }) => css`
      font-size: 0.95rem;
      a {
        position: relative;
        font-weight: 500;
        padding-right: 5px;
        :hover {
          color: ${theme.seaBlue};
          text-decoration: underline;
        }
        :active {
          color: ${theme.oceanBlue};
        }
        :after {
          content: "";
          border-top: 2px solid;
          border-right: 2px solid;
          border-color: currentColor;
          width: 10px;
          height: 10px;
          display: inline-block;
          transform: translateX(2px) rotate(45deg);
        }
      }
    `
  );
}
