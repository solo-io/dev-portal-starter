import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { mediaQueryWithScreenSize } from "../../Styles/breakpoints";
import { borderRadiusConstants } from "../../Styles/constants";

export namespace HomePageStyles {
  export const HomePageCategories = styled.div(
    ({ theme }) => css`
      width: 100%;
      padding: 30px;
      margin: 60px 0;
      border-radius: ${borderRadiusConstants.small};

      border: 1px solid ${theme.aprilGrey};
      background: ${theme.lightGreyTransparent};
      color: ${theme.novemberGrey};
    `
  );

  export const ApiCategoriesTitle = styled.div`
    font-size: 34px;
    text-align: center;
    margin-bottom: 20px;
  `;

  export const CategoriesList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
  `;

  export const CategoriesCard = styled.div(
    ({ theme }) => css`
      display: flex;
      flex-direction: column;
      min-height: 260px;
      width: min-content;
      max-width: 420px;

      ${mediaQueryWithScreenSize.mediumAndSmaller} {
        width: 100%;
        max-width: 100%;
        flex-grow: 1;
      }

      border-radius: ${borderRadiusConstants.small};

      border: 1px solid ${theme.splashBlue};
      background: ${theme.lightGreyTransparent};
      text-align: center;
      cursor: default;
    `
  );

  export const CategoryIconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    margin-bottom: 15px;

    svg {
      width: 100px;
      max-height: 100px;
    }
  `;

  export const CategoryImageHolder = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 225px;
    width: fit-content;
    max-width: 100%;
    ${mediaQueryWithScreenSize.mediumAndSmaller} {
      width: 100%;
    }

    overflow: hidden;
    margin: -1px -1px 0;
    border-radius: ${borderRadiusConstants.small} ${borderRadiusConstants.small}
      0 0;
    margin-bottom: 20px;

    img {
      // This is a best-guess background fit attempt for user-supplied images.
      height: 100%;
      ${mediaQueryWithScreenSize.mediumAndSmaller} {
        width: 100%;
      }
      object-fit: cover;
    }
  `;

  export const CategoryName = styled.div`
    font-size: 28px;
    font-weight: 600;
    padding: 0 40px;
  `;

  export const CategoryDescription = styled.div`
    font-size: 16px;
    font-weight: 400;
    padding: 10px 40px 30px;
  `;
}
