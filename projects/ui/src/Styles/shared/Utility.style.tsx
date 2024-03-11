import { css } from "@emotion/react";
import styled from "@emotion/styled";

export namespace UtilityStyles {
  export const StyledButtonContentsWithIcon = styled.div(
    ({ theme }) => css`
      display: flex;
      align-items: center;
      color: ${theme.lakeBlue};
      font-size: 0.8rem;
      gap: 10px;
    `
  );
}
