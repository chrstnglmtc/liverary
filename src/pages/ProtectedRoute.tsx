import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/authStore";
import { useEffect, useState, type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const user = getCurrentUser() || JSON.parse(sessionStorage.getItem("authUser") || "null");
    setIsAuthenticated(!!user?.token);
  }, []);

  // While checking, render nothing or a loader
  if (isAuthenticated === null) return <div className="text-center mt-20">Loading...</div>;

  // Not authenticated → redirect
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // Authenticated → render children
  return <>{children}</>;
}
