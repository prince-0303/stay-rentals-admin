import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute() {
    const { isAuthenticated, admin } = useAuthStore();

    if (!isAuthenticated || admin?.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
