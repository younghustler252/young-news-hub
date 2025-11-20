import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FullScreenSpinner } from "../components/ui/Loader";
import { ROUTE } from "./route";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, hydrating, user } = useAuth();

  // Wait for session restore before ANY redirect
  if (hydrating) return <FullScreenSpinner />;

  if (!isLoggedIn) return <Navigate to={ROUTE.login} replace />;

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
