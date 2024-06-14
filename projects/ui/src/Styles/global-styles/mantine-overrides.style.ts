import { css } from "@emotion/react";
import { colors } from "../colors";

export const mantineGlobalStyles = css`
  .mantine-Paper-root.mantine-Modal-content {
    border-radius: 15px;
  }

  // Overrides the Mantine component library's close button styles.
  .mantine-Modal-header .mantine-Modal-close {
    width: 1.75rem;
    height: 1.75rem;
    margin-right: 5px;
    svg {
      width: 24px;
      height: 24px;
      * {
        fill: #ccd0d5;
      }
    }
  }

  // Overrides the mantine tab styles.
  .mantine-Tabs-tabsList {
    border-bottom: 1px solid ${colors.aprilGrey};
    padding-bottom: 2px;
    button {
      font-size: 1rem;
      border: none;
      border-bottom: 2px solid transparent;
      &:hover {
        background-color: ${colors.splashBlueLight7};
      }
      &:active {
        background-color: ${colors.splashBlueLight5};
      }
      &:not([data-active="true"]) {
        span {
          color: ${colors.augustGrey};
        }
      }
      &[data-active="true"] {
        border-bottom: 2px solid ${colors.lakeBlue};
      }
    }
  }

  .mantine-UnstyledButton-root.mantine-Button-root {
    /* 
    // This would look good if we know it's not a subtle button.
    border: 1px solid ${colors.aprilGrey};
    */
    transition: 0.15s background-color;
    span {
      font-size: 1rem;
    }
    &:disabled {
      pointer-events: all;
      cursor: not-allowed;
      background-color: ${colors.marchGreyDark10};
      div.mantine-Text-root {
        color: ${colors.augustGrey};
      }
    }
  }
`;
