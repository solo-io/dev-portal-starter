import { Theme, css } from "@emotion/react";
import styled from "@emotion/styled";
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

export namespace ApisFilterStyles {
  export const FilterArea = styled.div(
    ({ theme }) => css`
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
          color: ${theme.oceanBlue};
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
    `
  );
}