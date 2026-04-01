import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showHomeButton?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading this content. Please try again.",
  onRetry,
  onGoHome,
  showHomeButton = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 text-center max-w-md mb-6">{message}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        {showHomeButton && onGoHome && (
          <Button onClick={onGoHome} variant="outline" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
}

export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
      <p className="text-sm text-red-800">{message}</p>
    </div>
  );
}

export function PageErrorState({
  error,
  onRetry,
}: {
  error?: Error;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
      <p className="text-base text-gray-600 text-center max-w-lg mb-2">
        We encountered an unexpected error. Our team has been notified and is working on a fix.
      </p>
      {error && (
        <details className="mt-4 max-w-2xl w-full">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            Technical details
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs text-gray-800 overflow-auto">
            {error.message}
            {"\n\n"}
            {error.stack}
          </pre>
        </details>
      )}
      <div className="flex items-center gap-3 mt-8">
        {onRetry && (
          <Button onClick={onRetry} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
          size="sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Go to Login
        </Button>
      </div>
    </div>
  );
}
