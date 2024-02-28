import { css } from "@emotion/react";
import { colors } from "../colors";

export const siteGlobalStyles = css`
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

  //
  // Animations
  //
  @keyframes animateCircles {
    to {
      transform: rotate(1turn);
    }
  }
  @keyframes shadowFade {
    to {
      box-shadow: 0 0 2em transparent, 0 0 4em, 0 0 6em, 0 0 8em, 0 0 10em,
        0 0 0 0.5em transparent;
    }
  }
`;
