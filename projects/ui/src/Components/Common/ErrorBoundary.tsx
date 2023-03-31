import * as React from "react";
import { Icon } from "../../Assets/Icons";

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
      <div className={`errorDisplayContainer ${this.props.class ?? ""}`}>
        <Icon.DireX />

        <div className="errorMessage">{this.props.fallback}</div>
      </div>
    ) : (
      this.props.children
    );
  }
}
