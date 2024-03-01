import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { makePrimaryTrimmedSmallWhiteContainerCSS } from "../PrimaryTrimmedSmallWhiteContainer";
import { borderRadiusConstants } from "../constants";

export namespace ListCardStyles {
  export const ListCardWithLink = styled.div(
    ({ theme }) => css`
      margin-bottom: 30px;
      border-radius: ${borderRadiusConstants.small};

      border: 1px solid ${theme.splashBlue};
      background: ${theme.lightGreyTransparent};
      box-shadow: 0px 2px 8px ${theme.darkGreyTransparent};

      .content {
        display: flex;

        .majorIconHolder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 192px;
          border-right: 1px solid ${theme.splashBlue};

          svg {
            width: 100px;
            max-width: 95%;
            height: 100px;

            &.colorIt * {
              stroke: ${theme.primary};
              fill: ${theme.primary};
            }
          }
        }

        .details {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 250px;
          min-height: 165px;
          padding: 20px;

          .title {
            margin-bottom: 10px;
            margin-left: 10px;
            font-size: 28px;
            font-weight: 600;
            color: ${theme.defaultColoredText};
          }
          .subtitle-list {
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            .subtitle-item {
              font-size: 14px;
              font-weight: 500;
              color: ${theme.defaultColoredText};
            }
          }

          .description {
            margin-top: 5px;
            margin-left: 10px;
            font-size: 16px;
            line-height: 22px;
            color: ${theme.augustGrey};
          }
          .metadataList {
            margin-top: 10px;
          }
        }
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        height: 43px;
        padding: 0 15px 0 25px;
        border-radius: ${`0 0 ${borderRadiusConstants.small} ${borderRadiusConstants.small}`};
        background: ${theme.splashBlue};

        .metaInfo {
          display: flex;
          align-items: center;

          svg {
            margin-right: 10px;
            width: 20px;
            height: 20px;

            * {
              fill: ${theme.primary};
            }
          }

          .typeTitle {
            ${makePrimaryTrimmedSmallWhiteContainerCSS(theme)}

            font-size: 14px;
            line-height: 22px;
          }
        }

        .typeIcon {
          svg {
            width: 28px;
            height: 28px;

            * {
              fill: ${theme.primary};
            }
          }
        }
      }

      //
      // Shared styles between API summary cards
      //
      transition: 0.1s box-shadow, 0.1s outline-color;
      outline-offset: 2px;
      outline: 2px solid transparent;
      &:hover {
        outline-color: ${theme.lakeBlue};
      }
      &:active {
        outline-color: ${theme.pondBlue};
        box-shadow: 0 0 5px ${theme.pondBlue};
      }
    `
  );
}
