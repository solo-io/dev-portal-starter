import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ContentWidthNav } from "../../Styles/ContentWidthHelpers";

export const headerHeightPx = 90;

export namespace HeaderStyles {
  export const StyledLogoImg = styled.img`
    height: ${headerHeightPx}px;
    padding: 5px 0px;
  `;

  export const StyledTopNavHeader = styled.header(
    ({ theme }) => css`
      grid-area: header;
      width: 100%;
      height: ${headerHeightPx}px;
      background: white;
      border-bottom: 1px solid ${theme.marchGrey};
      box-shadow: #253e580b 0px 2px 8px;

      // These are the hover/active styles for the links in the main top bar,
      // and links in the logged in user dropdown area.
      .userLoginArea.loggedIn,
      .logoContainer,
      .siteNavigating a.navLink,
      .userLoginArea .userHolder,
      a,
      button.logout {
        cursor: pointer;
        &:hover {
          color: ${theme.internalLinkColorDark10};
          background-color: ${theme.splashBlueLight10};
          border-color: ${theme.splashBlue};
        }
        &:active {
          color: ${theme.internalLinkColorDark10};
          background-color: ${theme.splashBlueLight7};
          border-color: ${theme.splashBlue};
        }

        // .active means that this is the page that the user is on.
        // This overrides the font color and border color so that it doesn't
        // get the same hover/active states.
        &.active,
        &.active:hover,
        &.active:active {
          color: ${theme.internalLinkColor};
          border-color: ${theme.internalLinkColor};
        }
      }
    `
  );

  export const StyledTopNavContent = styled(ContentWidthNav)(
    ({ theme }) => css`
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      user-select: none;

      height: 100%;

      color: ${theme.defaultText};

      .logoContainer {
        display: flex;
        align-items: center;
        margin-left: -12px;
        padding: 0 12px;
        width: auto;
        height: 100%;
      }

      .siteNavigating {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        height: 100%;
        gap: 5px;

        a.navLink {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 0px 12px;
          cursor: pointer;

          color: ${theme.externalLinkColor};
          border-bottom: 4px solid white;
          transition:
            background-color 0.25s,
            border-bottom-color 0.25s,
            color 0.25s;
          &.active,
          &.active:hover,
          &.active:active {
            color: ${theme.internalLinkColor};
            border-bottom-color: ${theme.internalLinkColor};
          }
        }

        .divider {
          height: 33px;
          width: 1px;
          background: ${theme.splashBlue};
        }
      }

      .userLoginArea {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 12px;
        margin-right: -12px;

        .userHolder {
          display: flex;
          align-items: center;
          margin-top: -4px;

          svg.userCircle {
            width: 40px;
            height: 40px;
            margin-right: 10px;

            * {
              fill: currentColor;
            }
          }

          svg.dropdownArrow {
            width: 14px;
            margin-left: 10px;
            * {
              stroke: currentColor;
              stroke-width: 2;
            }
          }
        }
      }
    `
  );
}
