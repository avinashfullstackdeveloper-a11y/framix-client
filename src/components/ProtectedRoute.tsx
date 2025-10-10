import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "@/lib/auth-client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const location = useLocation();

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
  if (!session?.user) {
    // Save the attempted location so we can redirect after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
