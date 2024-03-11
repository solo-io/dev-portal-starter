import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Flex } from "@mantine/core";

export namespace DetailsPageStyles {
  export const Section = styled(Flex)`
    flex-direction: column;
    gap: 30px;
  `;

  export const Title = styled.h2`
    font-size: 1.4rem;
    font-weight: 500;
    margin-bottom: -15px;
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
}
