import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import UserList from "@/pages/users/UserList";
import UserDetail from "@/pages/users/UserDetail";
import ListerList from "@/pages/listers/ListerList";
import ListerDetail from "@/pages/listers/ListerDetail";
import KYCList from "@/pages/kyc/KYCList";
import KYCDetail from "@/pages/kyc/KYCDetail";
import AdminEarningsDashboard from "@/pages/earnings/AdminEarningsDashboard";
import AdminListerEarningsDetail from "@/pages/earnings/AdminListerEarningsDetail";
import AdminOccupancy from "@/pages/occupancy/AdminOccupancy";

export function AppRouter() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={<UserList />} />
                        <Route path="/users/:id" element={<UserDetail />} />
                        <Route path="/listers" element={<ListerList />} />
                        <Route path="/listers/:id" element={<ListerDetail />} />
                        <Route path="/kyc" element={<KYCList />} />
                        <Route path="/kyc/:id" element={<KYCDetail />} />
                        <Route path="/earnings" element={<AdminEarningsDashboard />} />
                        <Route path="/earnings/:listerId" element={<AdminListerEarningsDetail />} />
                        <Route path="/occupancy" element={<AdminOccupancy />} />
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
