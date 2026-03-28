import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary.
 * Catches runtime errors in the component tree and renders a graceful fallback.
 * In production, `onError` should ship to an error-tracking service (Sentry, etc).
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
    }
    this.props.onError?.(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-900/30 border border-red-700/40 flex items-center justify-center text-3xl mb-5" aria-hidden="true">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Algo deu errado</h2>
          <p className="text-purple-300/60 text-sm mb-6 max-w-xs">
            Ocorreu um erro inesperado. Tente recarregar a página ou voltar ao início.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-xs text-red-400/70 bg-red-900/10 border border-red-900/30 rounded-xl p-4 mb-6 text-left max-w-lg overflow-auto max-h-32 w-full">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-sm font-semibold transition-colors"
            >
              Tentar novamente
            </button>
            <Link
              to="/"
              onClick={this.handleReset}
              className="px-5 py-2.5 border border-purple-700 hover:bg-purple-900/30 rounded-xl text-purple-300 text-sm font-semibold transition-colors"
            >
              Ir ao início
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Lightweight boundary for non-critical sections (cards, sidebars).
 * Shows an inline error instead of taking the whole page down.
 */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.warn('[SectionErrorBoundary]', error.message, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-900/10 border border-red-900/30 text-center"
        >
          <p className="text-red-400/80 text-sm">
            Não foi possível carregar este conteúdo.{' '}
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="underline hover:text-red-300 transition-colors"
            >
              Tentar novamente
            </button>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
