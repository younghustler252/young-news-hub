import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FullScreenSpinner } from "../components/ui/Loader";
import { ROUTE } from "./route";

/**
 * @param {ReactNode} children - Component(s) to render if allowed
 * @param {boolean} adminOnly - Restrict to admin users
 * @param {boolean} requireIncompleteProfile - Restrict to users who have incomplete profile
 */
const ProtectedRoute = ({
  children,
  adminOnly = false,
  requireIncompleteProfile = false,
}) => {
  const { isLoggedIn, hydrating, user } = useAuth();

  // Wait for session restore before ANY redirect
  if (hydrating) return <FullScreenSpinner />;

  if (!isLoggedIn) return <Navigate to={ROUTE.login} replace />;

  // Restrict admin-only routes
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to={ROUTE.home} replace />;
  }

  // Redirect users with complete profile away from onboarding
  if (requireIncompleteProfile && user?.username) {
    // Add other fields if necessary, e.g., bio, phone
    return <Navigate to={ROUTE.home} replace />;
  }

  // Redirect users with incomplete profile to onboarding
  if (!requireIncompleteProfile && !user?.username) {
    return <Navigate to={ROUTE.completeProfile} replace />;
  }

  return children;
};

export default ProtectedRoute;
