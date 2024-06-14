import { css } from "@emotion/react";
import styled from "@emotion/styled";

export namespace ApisPageStyles {
  export const ApiGridList = styled.div`
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
  `;

  export const NumberInCircle = styled.div(
    ({ theme }) => css`
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${theme.seaBlue};
      color: white;
      font-size: 0.9rem;
      font-weight: bold;
      border-radius: 50%;
      padding: 10px;
      min-width: 15px;
      width: fit-content;
      height: 25px;
    `
  );
}
