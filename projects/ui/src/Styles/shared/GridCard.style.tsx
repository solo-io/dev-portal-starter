import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { makePrimaryTrimmedSmallWhiteContainerCSS } from "../PrimaryTrimmedSmallWhiteContainer";
import { borderRadiusConstants } from "../constants";

export namespace GridCardStyles {
  export const GridCard = styled(NavLink)(
    ({ theme }) => css`
      display: flex;
      flex-direction: column;

      height: 100%;
      min-height: 260px;
      border-radius: ${borderRadiusConstants.small};

      border: 1px solid ${theme.splashBlue};
      background: ${theme.lightGreyTransparent};
      color: ${theme.defaultColoredText};
      text-align: center;

      .content {
        flex: 1;

        .apiImageHolder {
          display: flex;
          align-items: center;
          justify-content: center;

          height: 225px;
          width: calc(100% + 2px);
          overflow: hidden;
          margin: -1px -1px 0;
          border-radius: ${`${borderRadiusConstants.small} ${borderRadiusConstants.small} 0 0`};
          margin-bottom: 20px;

          img {
            width: 100%;
            min-height: 100%;
          }
        }

        .title {
          line-height: 32px;
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 10px;
          padding: 0 40px;
        }
        .description {
          color: ${theme.augustGrey};
          line-height: 22px;
          font-size: 16px;
          font-weight: 400;
          padding: 0 40px 5px;
          &:last-child {
            padding-bottom: 40px;
          }
        }
        .metadataList {
          margin: 10px;
          &:last-child {
            margin-bottom: 20px;
          }
        }
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: center;

        height: 43px;
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

            font-size: 16px;
            line-height: 22px;
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

  export const GridCardWithLink = styled(GridCard)().withComponent(NavLink);
}
