import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FullScreenSpinner } from "../components/ui/Loader";
import { ROUTE } from "./route";

const ProtectedRoute = ({
	children,
	adminOnly = false,
	requireIncompleteProfile = false,
	guestOnly = false,
}) => {
	const { isLoggedIn, hydrating, user } = useAuth();

	if (hydrating) return <FullScreenSpinner />;

	// Guests-only pages (login/register)
	if (guestOnly && isLoggedIn) {
		// Allow unverified users to access /verify
		if (user?.isEmailVerified === false) return children;
		return <Navigate to={ROUTE.home} replace />;
	}

	// Not logged in
	if (!guestOnly && !isLoggedIn) return <Navigate to={ROUTE.login} replace />;

	// Admin-only pages
	if (adminOnly && user?.role !== "admin") return <Navigate to={ROUTE.home} replace />;

	// Require incomplete profile
	if (requireIncompleteProfile && user?.username) return <Navigate to={ROUTE.home} replace />;

	// Logged-in users without username
	if (!requireIncompleteProfile && isLoggedIn && !user?.username) {
		if (user?.isEmailVerified === false) return <Navigate to={ROUTE.verify} replace />;
		return <Navigate to={ROUTE.completeProfile} replace />;
	}

	if (isLoggedIn && user?.isEmailVerified === false && !guestOnly) {
		return <Navigate to={ROUTE.verify} replace />;
	}

	return children;
};

export default ProtectedRoute;
