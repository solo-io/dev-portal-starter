import { css } from "@emotion/react";
import styled from "@emotion/styled";

export namespace ApisPageStyles {
  export const ApiGridList = styled.div`
    display: grid;
    grid-gap: 30px;
    grid-template-columns: 1fr 1fr 1fr;
  `;

  export const TabTitle = styled.div(
    ({ theme }) => css`
      .mantine-Tabs-tabsList {
        border-bottom: 1px solid ${theme.aprilGrey};
        padding-bottom: 2px;
        button {
          font-size: 1rem;
          border: none;
          border-bottom: 2px solid transparent;
          &:hover {
            background-color: ${theme.splashBlueLight7};
          }
          &:active {
            background-color: ${theme.splashBlueLight5};
          }
          &:not([data-active="true"]) {
            span {
              color: ${theme.augustGrey};
            }
          }
          &[data-active="true"] {
            border-bottom: 2px solid ${theme.lakeBlue};
          }
        }
      }
    `
  );
}
