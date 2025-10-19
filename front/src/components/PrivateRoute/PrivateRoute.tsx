import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

interface PrivateRouteProps {
	element: JSX.Element;
	requiredRole?: "admin" | "user";
}

export default function PrivateRoute({
	element,
	requiredRole,
}: PrivateRouteProps) {
	const { user } = useAuthStore();
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (requiredRole && user.role !== requiredRole) {
		return <Navigate to="/" replace />;
	}

	return element;
}
