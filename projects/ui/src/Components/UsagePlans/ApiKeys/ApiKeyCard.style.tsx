import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { borderRadiusConstants } from "../../../Styles/constants";

export const StyledApiKeyCardContainer = styled.div(
  ({ theme }) => css`
    margin-top: 10px;
    .apiKeyCard {
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      border-radius: ${borderRadiusConstants.small};
      border: 1px solid ${theme.splashBlue};
      padding: 5px 5px 5px 15px;
      background: white;

      &:last-of-type {
        margin-bottom: 0;
      }

      .accessIcon {
        display: flex;
        align-items: center;
        margin-right: 10px;

        svg {
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
      }

      .apiKeyKey {
        flex-grow: 1;
        height: 1.5em;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 10px 10px;
        padding: 10px 20px;
        // border-left: 1px solid ${theme.augustGrey};
      }

      .apiKeyActions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        button {
          padding: 5px;
        }
      }

      &.emptyListCard {
        line-height: 26px;

        .accessIcon svg {
          width: 76px;
          height: 76px;
        }

        .title {
          color: ${theme.defaultColoredText};
          font-size: 22px;
        }

        .description {
          font-size: 16px;
        }
      }

      &.recentlyGenerated {
        border-color: ${theme.darkGreen};
        margin-bottom: 5px;
      }
    }

    .recentlyGeneratedText {
      font-size: 14px;
      color: ${theme.darkGreen};
    }
  `
);
