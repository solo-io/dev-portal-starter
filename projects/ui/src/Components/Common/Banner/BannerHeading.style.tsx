import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ContentWidthDiv } from "../../../Styles/ContentWidthHelpers";
import { mediaQueryWithScreenSize } from "../../../Styles/breakpoints";
import { borderRadiusConstants } from "../../../Styles/constants";

export namespace BannerStyles {
  export const BannerContent = styled.div(
    ({ theme }) => css`
      position: relative;
      display: flex;
      align-items: center;

      left: 0;
      width: 52%;
      max-width: 52%;
      min-height: 187px;
      padding: 35px 40px;

      ${mediaQueryWithScreenSize.largeAndSmaller} {
        width: 60%;
        max-width: 60%;
      }
      ${mediaQueryWithScreenSize.mediumAndSmaller} {
        width: 100%;
        max-width: 100%;
      }

      background: white;

      border-radius: ${borderRadiusConstants.standard};
      border: 1px solid ${theme.splashBlue};

      z-index: 1;
    `
  );

  export const BannerCardRightContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
  `;

  export const DescriptionText = styled.div(
    ({ theme }) => css`
      font-size: 18px;
      line-height: 26px;
      color: ${theme.augustGrey};
    `
  );

  export const BigLeftIconContainer = styled.div(
    ({ theme }) => css`
      margin-right: 22px;
      svg {
        width: 140px;
        height: 140px;
        fill: ${theme.primary};
      }
    `
  );

  export const BannerHeadingContentContainer = styled(ContentWidthDiv)<{
    tall: boolean;
  }>(
    ({ tall, pageContentIsWide }) => css`
      position: relative;
      padding: 30px 30px 25px;
      margin-bottom: 40px;

      ${tall
        ? css`
            padding-top: 160px;
            padding-bottom: 130px;
            margin-bottom: 60px;
          `
        : ""}
      ${pageContentIsWide
        ? css`
            padding: 30px 30px 25px;
            margin-bottom: 40px;
          `
        : ""}
    `
  );

  export const BannerImageContainer = styled.div<{
    pageContentIsWide: boolean;
  }>(
    ({ pageContentIsWide }) => css`
      position: absolute;
      top: 10px;
      bottom: 0px;
      right: 30px;
      width: 66%;
      max-width: ${pageContentIsWide ? "51%" : "66%"};

      ${mediaQueryWithScreenSize.largeAndSmaller} {
        width: 70%;
        max-width: 70%;
      }
      ${mediaQueryWithScreenSize.mediumAndSmaller} {
        width: unset;
        max-width: 100%;
        right: 10px;
        left: 10px;
      }

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 15px;
      overflow: hidden;

      z-index: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `
  );
}
