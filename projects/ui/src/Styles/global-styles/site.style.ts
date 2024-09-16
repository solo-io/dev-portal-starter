import { css } from "@emotion/react";
import { colors } from "../colors";

export const siteGlobalStyles = css`
  *:not(code) {
    color: ${colors.neptuneBlue};
  }
  //
  // Reset HTML buttons
  //
  button {
    border: none;
    background: none;
    padding: 0;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: currentColor;
    cursor: pointer;
    /* color: ${colors.neptuneBlue}; */

    &.disabled {
      cursor: default;
      background: ${colors.augustGrey};
    }
  }

  //
  // Resetting a tags
  //
  a {
    color: ${colors.internalLinkColor};
    text-decoration: none;
  }

  svg.canRotate {
    transition: transform 0.25s;
    &.rotate180 {
      transform: rotate(180deg);
    }
  }
`;
