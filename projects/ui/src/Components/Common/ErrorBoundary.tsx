import { css } from "@emotion/react";
import styled from "@emotion/styled";
import * as React from "react";
import { Icon } from "../../Assets/Icons";

const ErrorDisplayContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    color: ${theme.darkRed};

    svg {
      width: 200px;
      height: 200px;
      max-width: 50%;

      * {
        fill: currentColor;
      }
    }

    .errorMessage {
      padding-top: 15px;
      text-align: center;
      font-size: 18px;
      font-weight: 500;
    }

    &.horizontalError {
      flex-direction: row;
      align-items: center;

      svg {
        width: 40px;
        height: 40px;
      }

      .errorMessage {
        padding-top: 0;
        margin-left: 10px;
      }
    }
  `
);

type State = {
  hasError: boolean;
  error: Error | null;
};

type ErrorBoundProps = React.PropsWithChildren<{
  fallback: React.ReactNode;
  class?: string;
}>;

// Error boundaries currently have to be classes.
export class ErrorBoundary extends React.Component<ErrorBoundProps, State> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }
  componentDidCatch(error: Error, info: object) {
    // eslint-disable-next-line no-console
    console.error("Error Boundary caught an error", error, info);
  }

  componentDidUpdate(prevProps: ErrorBoundProps) {
    if (prevProps.fallback !== this.props.fallback) {
      this.setState({ hasError: false });
    }
  }

  render() {
    return this.state.hasError ? (
      <ErrorDisplayContainer className={this.props.class ?? ""}>
        <Icon.DireX />

        <div className="errorMessage">{this.props.fallback}</div>
      </ErrorDisplayContainer>
    ) : (
      this.props.children
    );
  }
}
