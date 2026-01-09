import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
                    <div className="max-w-2xl w-full">
                        <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-200 p-8">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-10 h-10 text-red-600" />
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-black text-slate-800 text-center mb-3">
                                Etwas ist schief gelaufen
                            </h1>
                            <p className="text-slate-600 text-center mb-6">
                                Die Anwendung ist auf einen unerwarteten Fehler gestoßen.
                            </p>

                            {/* Error Details */}
                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                                <p className="text-sm font-bold text-red-900 mb-2">Fehlerdetails:</p>
                                <p className="text-sm text-red-700 font-mono break-all">
                                    {this.state.error?.message || 'Unbekannter Fehler'}
                                </p>
                            </div>

                            {/* Stack Trace (Development Only) */}
                            {import.meta.env.DEV && this.state.errorInfo && (
                                <details className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                                    <summary className="text-sm font-bold text-slate-700 cursor-pointer">
                                        Stack Trace (Entwicklermodus)
                                    </summary>
                                    <pre className="text-xs text-slate-600 mt-2 overflow-auto max-h-40">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={this.handleReload}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-12"
                                >
                                    <RefreshCw className="w-5 h-5 mr-2" />
                                    Seite neu laden
                                </Button>
                                <Button
                                    onClick={this.handleReset}
                                    variant="outline"
                                    className="flex-1 border-2 rounded-xl font-bold h-12"
                                >
                                    <Home className="w-5 h-5 mr-2" />
                                    Zur Startseite
                                </Button>
                            </div>

                            {/* Help Text */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-slate-500">
                                    Wenn das Problem weiterhin besteht, wenden Sie sich bitte an den Support.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
