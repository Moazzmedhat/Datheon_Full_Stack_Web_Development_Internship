import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-fallback" role="alert">
          <div className="error-fallback__icon" aria-hidden="true">⚠️</div>
          <h2>Something went wrong</h2>
          <p className="error-fallback__message">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <div className="error-fallback__actions">
            <button type="button" className="btn btn-primary" onClick={this.handleReset}>
              Try again
            </button>
            <button type="button" className="btn btn-secondary" onClick={this.handleReload}>
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
