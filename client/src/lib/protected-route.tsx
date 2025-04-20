import { useAuth, checkAccess } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
  roles?: string[];
}

export function ProtectedRoute({
  path,
  component: Component,
  roles = [],
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // If no roles are specified, just check if user is logged in
  if (roles.length === 0 && !user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Check if user has required roles
  if (roles.length > 0 && (!user || !checkAccess(user, roles))) {
    return (
      <Route path={path}>
        <Redirect to="/unauthorized" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}