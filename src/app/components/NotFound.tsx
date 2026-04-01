import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

export function NotFound() {
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
