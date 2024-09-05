import { Theme, css } from "@emotion/react";
import styled from "@emotion/styled";
import { makePrimaryTrimmedSmallWhiteContainerCSS } from "../../../Styles/PrimaryTrimmedSmallWhiteContainer";
import { borderRadiusConstants } from "../../../Styles/constants";

const makeFilterPlaceholderTextsCSS = (theme: Theme) => css`
  color: ${theme.augustGrey};
  font-weight: 400;
  font-size: 16px;
`;

const makeFilterTypeIconHolderCSS = (theme: Theme) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-right: 6px;
  border-right: 1px solid ${theme.aprilGrey};

  svg {
    width: 18px;
    height: 18px;
    * {
      fill: ${theme.augustGrey};
    }
  }
`;

const makeFilterBoxCSS = (theme: Theme) => css`
  display: flex;
  align-items: center;
  height: 34px;
  line-height: 34px;
  border-radius: ${borderRadiusConstants.small};
  border: 1px solid ${theme.aprilGrey};

  background: white;
`;

export const StyledEmptyContent = styled.div(
  ({ theme }) => css`
    text-align: center;
    line-height: 2rem;
    background-color: ${theme.marchGrey};
    padding: 30px;
  `
);

export const StyledApisListMain = styled.main(
  ({ theme }) => css`
    padding: 0 30px;
    margin-bottom: 60px;

    /*
  *  LIST FILTER PARTS - STARTS
  */
    .filterArea {
      margin-bottom: 30px;
      border-radius: ${borderRadiusConstants.small};

      border: 1px solid ${theme.splashBlue};
      background: ${theme.lightGreyTransparent};
      box-shadow: 0px 2px 8px ${theme.darkGreyTransparent};

      // ADDING FILTER AREA
      .choicesArea {
        display: flex;
        align-items: center;
        min-height: 50px;
        padding: 0 15px 0 25px;

        .title {
          width: 65px;
          margin-right: 25px;
          font-size: 24px;
          font-weight: 600;
        }

        .filterBox {
          ${makeFilterBoxCSS(theme)}
        }

        .filterTypeIconHolder {
          ${makeFilterTypeIconHolderCSS(theme)}
        }

        .filterPlaceholderTexts {
          ${makeFilterPlaceholderTextsCSS(theme)}
        }

        .textFilter,
        .pairsFilter,
        .dropdownFilter {
          flex: 1;
          margin-right: 15px;
        }
        .textFilter {
          position: relative;
          input {
            font-size: 16px;
            padding-right: 30px;
            &::placeholder {
              ${makeFilterPlaceholderTextsCSS(theme)}
            }
          }
          svg {
            position: absolute;
            top: 10px;
            right: -2px;
            width: 18px;
            height: 18px;
            margin: 0 10px;
            * {
              stroke: ${theme.augustGrey};
            }
          }
        }
        .pairsFilter {
          ${makeFilterBoxCSS(theme)}
          padding: 0px 5px;

          .tagHolder {
            ${makeFilterTypeIconHolderCSS(theme)}
            padding: 0px 10px 0px 5px;
            margin-right: 0px;
          }

          .pairHolder {
            display: flex;
            padding: 0px 4px;
            gap: 4px;
            align-items: center;
            color: ${theme.augustGrey};

            input {
              border-radius: ${borderRadiusConstants.small};
              min-height: unset;
              height: 28px;
              outline: none;
              box-shadow: none;
              font-size: 16px;

              &::placeholder {
                ${makeFilterPlaceholderTextsCSS(theme)}
              }
            }
          }

          .addButtonHolder {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 34px;
            width: 34px;

            button {
              svg {
                height: 21px;
                width: 21px;
                * {
                  fill: ${theme.augustGrey};
                }
              }
              border-radius: 50%;
              &:hover {
                background-color: lighten(${theme.marchGrey}, 4);
              }
              &:active {
                background-color: ${theme.marchGrey};
              }
            }
          }
        }
        .dropdownFilter {
          ${makeFilterBoxCSS(theme)}
          .addTypeFilterSelect {
            flex-grow: 1;
          }
          input {
            border: none;
            &::placeholder {
              ${makeFilterPlaceholderTextsCSS(theme)}
            }
            &:focus-visible {
              outline: 1px solid ${theme.primary};
              outline-offset: 1px;
            }
          }

          .gearHolder {
            ${makeFilterTypeIconHolderCSS(theme)}

            margin-right: 0;
          }

          .dropdownTrigger {
            ${makeFilterPlaceholderTextsCSS(theme)}
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;
            cursor: pointer;
            padding-left: 6px;
            border-radius: ${`0 ${borderRadiusConstants.small} ${borderRadiusConstants.small} 0`};
            height: 32px;

            svg {
              width: 14px;
              margin: 0 10px;

              * {
                stroke: currentColor;
              }
            }

            &[disabled] {
              background: ${theme.januaryGrey};
              color: ${theme.aprilGrey};
            }
          }
        }
      }

      //  FILTERS IN EFFECT
      .currentFiltersArea {
        display: flex;

        padding: 8px 15px 0 25px;
        border-radius: ${`0 0 ${borderRadiusConstants.small} ${borderRadiusConstants.small}`};
        background: ${theme.splashBlue};
      }
    }
    /*
  *  LIST FILTER PARTS - ENDS
  */

    /*
  *  FILTER [GRID AREA AND GRID CARDS] - STARTS
  */
    .apiGridList {
      display: grid;
      grid-gap: 30px;
      grid-template-columns: 1fr 1fr 1fr;

      a.apiGridCard {
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
      }
    }
    /*
  *  FILTER [GRID] - ENDS
  */

    /*
  *  FILTER [WIDE CARDS] - STARTS
  */
    .apiListCard {
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
    }
    /*
  *  FILTER [WIDE CARDS] - ENDS
  */

    // Wide + Grid Cards
    // Shared styles
    .apiListCard,
    .apiGridList a.apiGridCard {
      transition:
        0.1s box-shadow,
        0.1s outline-color;
      outline-offset: 2px;
      outline: 2px solid transparent;
      &:hover {
        outline-color: ${theme.lakeBlue};
      }
      &:active {
        outline-color: ${theme.pondBlue};
        box-shadow: 0 0 5px ${theme.pondBlue};
      }
    }
  `
);
