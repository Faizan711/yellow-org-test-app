import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
    isAdmin?: boolean;
}

interface State {
    hasError: boolean;
    caughtError?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        caughtError: undefined,
    };

    public static getDerivedStateFromError(_Error: Error): State {
        return { hasError: true, caughtError: _Error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (!this.props.isAdmin) {
            console.error(
                `%cAn ${error?.name} has occured! \nContact the authorities for more details.`,
                "background: #FFE7E7; color: #D10000; width: 200px;"
            );
        } else {
            console.error("Uncaught error:", error, errorInfo);
        }
    }

    public render() {
        if (this.state.hasError) {
            return (
                <span className="text-2xl m-auto text-center font-semibold text-neutral-control-layer-color-60">
                    <h1>Sorry.. there was an {this.state.caughtError ? this.state.caughtError?.name : "error"}</h1>
                    {this.props?.isAdmin ? (
                        <h1>Please check the console for more detailed information.</h1>
                    ) : (
                        <h1>Contact the authorities for more details.</h1>
                    )}
                </span>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
