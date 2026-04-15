import React, { ReactNode, ErrorInfo } from 'react';

/**
 * 🛡️ ErrorBoundary Component
 * Catches errors in child components and displays graceful fallback UI
 * Prevents single component error from crashing entire app
 * 
 * Usage:
 *   <ErrorBoundary level="page">
 *     <MyComponent />
 *   </ErrorBoundary>
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  level?: 'app' | 'page' | 'section' | 'widget';
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallback?: ReactNode;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 ErrorBoundary caught error:', error);
      console.error('📍 Component Stack:', errorInfo.componentStack);
    }

    // Update state with error details
    this.setState(prev => ({
      error,
      errorInfo,
      errorCount: prev.errorCount + 1,
    }));

    // Call optional error handler (e.g., for sending to error tracking service)
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error if resetKeys changed
    if (this.state.hasError && this.props.resetKeys && prevProps.resetKeys) {
      const keysChanged = this.props.resetKeys.some(
        (key, index) => key !== prevProps.resetKeys![index]
      );
      if (keysChanged) {
        this.resetError();
      }
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { level = 'section', fallback } = this.props;
      const { error, errorCount } = this.state;

      // Custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Error thresholds - prevent infinite error loops
      if (errorCount > 3) {
        return <ErrorThresholdExceeded level={level} onReset={this.resetError} />;
      }

      // Different UI based on error level
      switch (level) {
        case 'app':
          return <AppLevelError error={error} onReset={this.resetError} />;
        case 'page':
          return <PageLevelError error={error} onReset={this.resetError} />;
        case 'section':
          return <SectionLevelError error={error} onReset={this.resetError} />;
        case 'widget':
          return <WidgetLevelError error={error} onReset={this.resetError} />;
        default:
          return <SectionLevelError error={error} onReset={this.resetError} />;
      }
    }

    return this.props.children;
  }
}

// ============================================================
// Error Display Components by Severity Level
// ============================================================

/**
 * 🛑 App-Level Error (most critical - affects entire app)
 */
const AppLevelError: React.FC<{ error: Error | null; onReset: () => void }> = ({ error, onReset }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#fff',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}
  >
    <div style={{ maxWidth: '600px', textAlign: 'center' }}>
      <div
        style={{
          fontSize: '64px',
          marginBottom: '20px',
          animation: 'pulse 2s infinite',
        }}
      >
        ⚠️
      </div>

      <h1 style={{ fontSize: '32px', marginBottom: '12px', fontWeight: 'bold' }}>
        Oops! Something went wrong
      </h1>

      <p style={{ fontSize: '16px', color: '#ccc', marginBottom: '24px', lineHeight: '1.6' }}>
        We encountered an unexpected error and had to reload the app. Our team has been notified.
      </p>

      {process.env.NODE_ENV === 'development' && error && (
        <details
          style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            textAlign: 'left',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
            Debug Info (Development Only)
          </summary>
          <pre
            style={{
              fontSize: '12px',
              color: '#ff6b6b',
              overflow: 'auto',
              maxHeight: '200px',
              margin: '0',
            }}
          >
            {error.message}
          </pre>
        </details>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '12px 24px',
            background: '#8b5cf6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#7c3aed')}
          onMouseLeave={e => (e.currentTarget.style.background = '#8b5cf6')}
        >
          Go to Home
        </button>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            color: '#8b5cf6',
            border: '2px solid #8b5cf6',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Reload Page
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  </div>
);

/**
 * 📄 Page-Level Error (specific route page)
 */
const PageLevelError: React.FC<{ error: Error | null; onReset: () => void }> = ({ error, onReset }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(139,92,246,0.02) 100%)',
      padding: '20px',
    }}
  >
    <div style={{ maxWidth: '500px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>

      <h2 style={{ fontSize: '24px', marginBottom: '12px', fontWeight: 'bold', color: '#1a1a2e' }}>
        Page Error
      </h2>

      <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
        The page you're trying to access encountered an error. Please try going back or refreshing.
      </p>

      {process.env.NODE_ENV === 'development' && error && (
        <details
          style={{
            background: 'rgba(139,92,246,0.05)',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            textAlign: 'left',
            border: '1px solid rgba(139,92,246,0.1)',
          }}
        >
          <summary style={{ cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
            Error Details
          </summary>
          <pre style={{ fontSize: '11px', margin: '8px 0 0 0', overflow: 'auto', maxHeight: '150px' }}>
            {error.message}
          </pre>
        </details>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '10px 20px',
            background: '#8b5cf6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#7c3aed')}
          onMouseLeave={e => (e.currentTarget.style.background = '#8b5cf6')}
        >
          Go Back
        </button>

        <button
          onClick={onReset}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#8b5cf6',
            border: '2px solid #8b5cf6',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Retry
        </button>
      </div>
    </div>
  </div>
);

/**
 * 📋 Section-Level Error (below-fold section)
 */
const SectionLevelError: React.FC<{ error: Error | null; onReset: () => void }> = ({ error, onReset }) => (
  <div
    style={{
      padding: '60px 20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(139,92,246,0.03) 0%, rgba(139,92,246,0.01) 100%)',
      borderRadius: '12px',
      margin: '40px 20px',
      border: '1px solid rgba(139,92,246,0.1)',
    }}
  >
    <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>

    <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: 'bold', color: '#1a1a2e' }}>
      Section Unavailable
    </h3>

    <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
      This section encountered an error and couldn't load.
    </p>

    {process.env.NODE_ENV === 'development' && error && (
      <details
        style={{
          background: 'rgba(139,92,246,0.05)',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '12px',
          textAlign: 'left',
          border: '1px solid rgba(139,92,246,0.1)',
          fontSize: '12px',
        }}
      >
        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Details</summary>
        <pre style={{ margin: '6px 0 0 0', overflow: 'auto', maxHeight: '120px', fontSize: '11px' }}>
          {error.message}
        </pre>
      </details>
    )}

    <button
      onClick={onReset}
      style={{
        padding: '8px 16px',
        background: '#8b5cf6',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#7c3aed')}
      onMouseLeave={e => (e.currentTarget.style.background = '#8b5cf6')}
    >
      Try Again
    </button>
  </div>
);

/**
 * 🎁 Widget-Level Error (small component)
 */
const WidgetLevelError: React.FC<{ error: Error | null; onReset: () => void }> = ({ error, onReset }) => (
  <div
    style={{
      padding: '16px',
      textAlign: 'center',
      background: 'rgba(139,92,246,0.05)',
      borderRadius: '8px',
      border: '1px solid rgba(139,92,246,0.1)',
    }}
  >
    <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px 0' }}>
      💡 Widget unavailable
    </p>

    <button
      onClick={onReset}
      style={{
        padding: '6px 12px',
        background: '#8b5cf6',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#7c3aed')}
      onMouseLeave={e => (e.currentTarget.style.background = '#8b5cf6')}
    >
      Retry
    </button>
  </div>
);

/**
 * 🔁 Error Threshold Exceeded (prevent infinite loops)
 */
const ErrorThresholdExceeded: React.FC<{ level: string; onReset: () => void }> = ({ level, onReset }) => {
  if (level === 'app') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a2e',
          color: '#fff',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '600px', padding: '20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔴</div>
          <h1 style={{ fontSize: '28px', marginBottom: '12px' }}>Critical Error Loop Detected</h1>
          <p style={{ fontSize: '16px', color: '#ccc', marginBottom: '24px' }}>
            The application is in a critical error state. Please contact support or try clearing your browser cache.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 24px',
              background: '#8b5cf6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(139,92,246,0.05)', borderRadius: '8px' }}>
      <p style={{ color: '#666', marginBottom: '12px' }}>
        ⚠️ This component is experiencing repeated errors
      </p>
      <button
        onClick={onReset}
        style={{
          padding: '8px 16px',
          background: '#8b5cf6',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorBoundary;
