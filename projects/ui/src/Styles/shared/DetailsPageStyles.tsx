import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Flex } from "@mantine/core";
import { svgColorReplace } from "../utils";

export namespace DetailsPageStyles {
  export const Section = styled(Flex)`
    flex-direction: column;
  `;

  export const Title = styled.h2`
    font-size: 1.4rem;
    font-weight: 500;
    padding-bottom: 15px;
  `;

  export const CardTitleSmall = styled.div`
    font-size: 1.2rem;
    margin-bottom: 5px;
    text-align: left;
    font-weight: 500;
  `;

  export const OAuthClientRow = styled(Flex)`
    font-size: 0.9rem;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  `;

  export const OAuthClientId = styled.span(
    ({ theme }) => css`
      color: ${theme.augustGrey};
      margin-right: 5px;
    `
  );

  export const AddItemForm = styled.form(
    () => css`
      padding: 10px 0px;
      display: flex;
      gap: 15px;
      .mantine-Input-wrapper {
        input {
          height: 100%;
        }
        flex-grow: 1;
      }
    `
  );

  export const EditButtonAndTooltipContainer = styled.div(
    ({ theme }) => css`
      display: flex;
      flex-grow: 1;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      button {
        padding: 10px 0px;
        width: unset;
        min-width: unset;
      }
      svg {
        /* width: 20px; */
        height: 100%;
      }
      ${svgColorReplace(theme.augustGrey)}
    `
  );
}
