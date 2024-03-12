import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Color } from "../utils";

export namespace UtilityStyles {
  export const StyledButtonContentsWithIcon = styled.div<{ color?: Color }>(
    ({ theme, color }) => css`
      display: flex;
      align-items: center;
      color: ${color ?? theme.lakeBlue};
      font-size: 0.8rem;
      gap: 10px;
    `
  );
}
