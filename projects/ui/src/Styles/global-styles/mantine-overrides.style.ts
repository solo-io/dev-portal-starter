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
`;
