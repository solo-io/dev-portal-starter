import { css } from "@emotion/react";

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
`;
