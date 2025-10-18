import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "@/lib/auth-client";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const location = useLocation();
  const { user } = useAuth();

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  // Block access if user state is null (frontend-only deletion)
  if (!session?.user || !user) {
    // Save the attempted location so we can redirect after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Only allow admins for admin routes
  if (location.pathname.startsWith("/admin") && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
