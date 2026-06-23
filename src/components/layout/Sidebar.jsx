import { NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPendingKYCCount } from "@/api/kyc";
import { useAuthStore } from "@/store/authStore";
import {
    LayoutDashboard,
    Users,
    UserCheck,
    FileText,
    LogOut,
    Shield,
    ChevronRight,
    IndianRupee,
    Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/users", label: "Users", icon: Users },
    { to: "/listers", label: "Listers", icon: UserCheck },
    { to: "/kyc", label: "KYC Management", icon: FileText, badge: true },
    { to: "/earnings", label: "Earnings", icon: IndianRupee },
    { to: "/occupancy", label: "Occupancy", icon: Home },
];

export function Sidebar() {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);
    const admin = useAuthStore((s) => s.admin);

    const { data: pendingData } = useQuery({
        queryKey: ["kyc-pending-count"],
        queryFn: () => getPendingKYCCount().then((r) => r.data),
        refetchInterval: 30000,
        retry: false,
    });

    const pendingCount = pendingData?.count || pendingData?.pending_count || 0;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground leading-tight">Admin Panel</p>
                    <p className="text-xs text-muted-foreground">Rental Platform</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map(({ to, label, icon: Icon, badge, exact }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={exact}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-sidebar-foreground hover:bg-accent hover:text-foreground"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span className="flex-1">{label}</span>
                                {badge && pendingCount > 0 && (
                                    <span className={cn(
                                        "text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                                        isActive ? "bg-white/20 text-white" : "bg-red-500 text-white"
                                    )}>
                                        {pendingCount > 99 ? "99+" : pendingCount}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Admin user info */}
            <div className="px-3 py-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                            {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {admin?.name || "Admin"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {admin?.email || "admin@platform.com"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
