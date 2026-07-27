import React, { useState, useEffect, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

export default function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Caught error:", event.error);
      setError(event.error || new Error(event.message));
      setHasError(true);
    };

    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      // Log unhandled rejections for monitoring without breaking UI rendering
      console.warn("Unhandled promise rejection intercepted:", event.reason);
      // Prevent browser's default ugly red console popup if desired or allow standard logging
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", unhandledRejectionHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", unhandledRejectionHandler);
    };
  }, []);

  const handleReload = () => {
    setHasError(false);
    setError(null);
    window.location.reload();
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Something went wrong</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            An unexpected error occurred while rendering the page. You can refresh or return to the main dashboard.
          </p>
          {error && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-red-300 text-left overflow-x-auto max-h-32">
              {error.message}
            </div>
          )}
          <button
            onClick={handleReload}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-blue-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
