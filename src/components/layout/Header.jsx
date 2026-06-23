import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

const breadcrumbMap = {
    "/": "Dashboard",
    "/users": "User Management",
    "/listers": "Lister Management",
    "/kyc": "KYC Management",
};

function getBreadcrumb(pathname) {
    if (breadcrumbMap[pathname]) return breadcrumbMap[pathname];
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
        const base = breadcrumbMap[`/${parts[0]}`] || parts[0];
        return `${base} / Detail`;
    }
    return "";
}

export function Header() {
    const location = useLocation();
    const title = getBreadcrumb(location.pathname);

    return (
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
            <div>
                <h1 className="text-base font-semibold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
