import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Modal } from "@mantine/core";
import { borderRadiusConstants } from "../../Styles/constants";

export const StyledMantineModal = styled(Modal)(
  ({ theme }) => css`
    .mantine-Modal-body {
      padding: 0px;
      .modalBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 35px;
        /* max-width: 425px; */
        max-width: 440px;

        .modalHeader {
          margin-bottom: 15px;

          svg {
            width: 110px;
            max-height: 110px;
          }
        }
        .modalTitle {
          margin-bottom: 12px;
          font-size: 28px;
          line-height: 38px;
          color: ${theme.defaultColoredText};
        }

        .modalBody {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
      }
    }
    .generateKeyModalBody,
    .keyDetailsModalBody {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      .keyName {
        margin-bottom: 15px;
        color: ${theme.augustGrey};
        padding: 0px 20px;
        max-width: 100%;
        word-break: break-all;
      }

      .inputLine,
      .keyIdLine {
        width: 100%;
        margin-bottom: 15px;
      }

      .inputLine {
        padding: 0 40px;
        margin-bottom: 20px;
        input {
          font-size: 16px;
        }
      }

      .keyIdLine {
        font-size: 14px;
        line-height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        button {
          display: inline-block;
          .keyId {
            margin-right: 10px;
            font-weight: normal;
            color: ${theme.internalLinkColor};
          }
        }
      }

      .planAccessCarveOut {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 10px 40px;
        margin-top: 5px;
        margin-bottom: 25px;
        background: ${theme.splashBlue};
        text-align: center;

        .title,
        .planName .title {
          display: inline-block;
          max-width: 100%;
          word-break: break-word;
        }
        .title {
          margin-right: 5px;
          font-size: 26px;
          padding: 8px 0;
          color: ${theme.defaultColoredText};
        }
        .planName {
          color: ${theme.augustGrey};
          font-size: 18px;
        }
        .planDescription {
          font-weight: 600;
          color: ${theme.defaultColoredText};
          padding-top: 5px;
          font-size: 18px;
        }
      }

      .pairHolder {
        display: flex;
        align-items: center;
        gap: 5px;
        color: ${theme.augustGrey};
        margin-bottom: 15px;

        margin-top: 5px;
        .textHolder {
          flex-grow: 1;
          input {
            border-radius: ${borderRadiusConstants.small};

            border: 1px solid ${theme.aprilGrey};
            outline: none;
            box-shadow: none;

            height: 25px;
            line-height: 25px;
            padding: 0 6px;

            &::placeholder {
              @extend .filterPlaceholderTexts;
            }
          }
        }
      }

      .customMetadata {
        padding: 0 20px;
        > label.title {
          font-size: 26px;
          // Add these subtitle styles if adding
          // the "Meta Data (optional)" subtitle text.
          // display: flex;
          // gap: 10px;
          // > span.subtitle {
          //   font-size: 18px;
          //   color: ${theme.augustGrey};
          // }
        }
        margin-bottom: 15px;
        text-align: center;
        .metadataList {
          margin-top: 15px;
          justify-content: center;
        }
      }

      .addButtonHolder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 34px;
        width: 34px;

        svg {
          height: 21px;
          width: 21px;

          * {
            fill: ${theme.augustGrey};
          }
        }
      }
    }
  `
);
