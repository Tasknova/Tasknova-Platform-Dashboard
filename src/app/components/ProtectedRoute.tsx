import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LoadingState } from "./LoadingState";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "rep" | "manager" | "admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userEmail = localStorage.getItem("userEmail");

    // Check if user is logged in
    if (!userRole || !userEmail) {
      navigate("/");
      return;
    }

    // Check if user has required role
    if (requiredRole && userRole !== requiredRole) {
      navigate(`/${userRole}`);
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [requiredRole, navigate]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
