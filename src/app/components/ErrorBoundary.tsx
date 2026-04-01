import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
              <AlertTriangle className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <p className="text-lg text-gray-600 mb-6">Page not found</p>
            <p className="text-sm text-gray-500 mb-8 max-w-md">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{error.status}</h1>
          <p className="text-lg text-gray-600 mb-6">{error.statusText}</p>
          <Link to="/">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Oops!</h1>
        <p className="text-lg text-gray-600 mb-6">Something went wrong</p>
        <p className="text-sm text-gray-500 mb-8 max-w-md">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>
          <Link to="/">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
