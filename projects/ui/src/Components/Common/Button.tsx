import { Theme, css } from "@emotion/react";
import styled from "@emotion/styled";

export const makeStyledButtonCSS = (theme: Theme) => css`
  // A consistent button for general use.
  //  We've avoided being opionated here about "display"
  //    type here, but one could certainly follow "inline-..." conventions.
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
  cursor: pointer;

  border-radius: 2px;
  height: 40px;
  min-width: 90px;
  padding: 0 22px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.1s linear;

  //
  // Primary states
  //
  border: 1px solid ${theme.januaryGrey};
  background-color: ${theme.lakeBlue};
  &:hover {
    background-color: ${theme.primaryLight10};
  }
  &:active {
    background-color: ${theme.primaryLight20};
  }

  //
  // Pale states
  //
  &.paleButton {
    border-color: ${theme.primary};
    background-color: white;
    color: ${theme.primary};
    &:hover {
      background-color: ${theme.primaryLight10};
      border-color: ${theme.primaryLight10};
      color: white;
    }
    &:active {
      background-color: ${theme.primaryLight20};
      border-color: ${theme.primaryLight20};
      color: white;
    }
  }

  &.smallButton {
    height: 26px;
    line-height: 26px;
  }

  //
  // Just text states
  //
  &.justText {
    display: inline;
    height: auto;
    line-height: inherit;
    border: none;
    background-color: transparent;
    font-size: inherit;
    padding: 0;

    color: ${theme.primary};
    font-weight: 500;
    &:hover {
      color: ${theme.primaryLight10};
    }
    &:active {
      color: ${theme.primaryLight20};
    }
  }

  //
  // Success states
  //
  &.success {
    background-color: ${theme.midGreen};
    &:hover {
      background-color: ${theme.midGreenLight10};
    }
    &:active {
      background-color: ${theme.midGreenLight20};
    }
  }

  //
  // Outline states
  //
  &.outline {
    color: ${theme.lakeBlue};
    border: 1px solid ${theme.lakeBlue};
    background-color: white;
    &:hover {
      color: white;
      background-color: ${theme.primaryLight10};
      border: none;
    }
    &:active {
      color: white;
      background-color: ${theme.primaryLight20};
      border: none;
    }
  }

  //
  // Error states
  //
  &.error {
    background-color: ${theme.pumpkinOrange};
    &:hover {
      background-color: ${theme.pumpkinOrangeLight10};
    }
    &:active {
      background-color: ${theme.pumpkinOrangeLight20};
    }
  }

  //
  // Disabled states
  //
  &.disabled,
  &.disabled:hover,
  &.disabled:active {
    cursor: not-allowed;
    background-color: ${theme.augustGrey};
  }
`;

export const StyledButton = styled.button(({ theme }) =>
  makeStyledButtonCSS(theme)
);

export function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  const { disabled, ...rest } = props;

  return (
    <StyledButton
      {...rest}
      aria-disabled={disabled}
      className={`styledButton ${rest.className ?? ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      {rest.children}
    </StyledButton>
  );
}
