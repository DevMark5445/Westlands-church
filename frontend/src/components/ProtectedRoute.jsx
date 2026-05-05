import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute: Ensures user is authenticated and has required role
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string|string[]} requiredRole - Role(s) required to access the route
 * @param {string} fallbackPath - Path to redirect to if unauthorized (default: "/login")
 */
export default function ProtectedRoute({ children, requiredRole, fallbackPath = "/login" }) {
  const { user, isAuthenticated, isInitialized } = useAuth();

  // Wait for auth to initialize
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role if specified
  if (requiredRole) {
    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRole = user.role?.toLowerCase() || "user";

    if (!rolesArray.map(r => r.toLowerCase()).includes(userRole)) {
      // User doesn't have required role - redirect to their appropriate dashboard
      if (userRole === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
