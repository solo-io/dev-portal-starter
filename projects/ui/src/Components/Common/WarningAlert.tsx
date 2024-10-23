import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { WarningExclamation } from "../../Assets/Icons/Icons";
import { borderRadiusConstants } from "../../Styles/constants";
import { Color, svgColorReplace } from "../../Styles/utils";

const AlertContainer = styled.div(
  ({ theme }) => css`
    padding: 12px;
    background-color: ${theme.lightYellow};
    border-radius: ${borderRadiusConstants.small};

    display: flex;
    align-items: center;
    justify-content: flex-start;

    ${svgColorReplace(theme.darkYellowDark20 as Color)};
    > svg {
      margin-right: 10px;
      min-width: 24px;
    }

    * {
      line-height: 1.3rem;
      font-size: 0.95rem;
      color: ${theme.darkYellowDark20};
    }
  `
);

export function WarningAlert(props: { children?: React.ReactNode }) {
  return (
    <AlertContainer>
      <WarningExclamation width={"24px"} height={"24px"} />
      <div>{props.children}</div>
    </AlertContainer>
  );
}
