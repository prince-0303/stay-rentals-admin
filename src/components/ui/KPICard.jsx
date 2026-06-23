import { cn } from "@/lib/utils";

export function KPICard({ title, value, icon: Icon, description, trend, isLoading = false, color = "blue" }) {
    const colorMap = {
        blue: "text-blue-400 bg-blue-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
        amber: "text-amber-400 bg-amber-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        red: "text-red-400 bg-red-500/10",
    };

    if (isLoading) {
        return (
            <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-10 w-10 bg-muted rounded-lg" />
                </div>
                <div className="h-8 bg-muted rounded w-20 mb-2" />
                <div className="h-3 bg-muted rounded w-32" />
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors group">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {Icon && (
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorMap[color] || colorMap.blue)}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold text-foreground tracking-tight">
                {value ?? "—"}
            </p>
            {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
                <p className={cn("text-xs mt-1 font-medium", trend > 0 ? "text-emerald-400" : "text-red-400")}>
                    {trend > 0 ? "+" : ""}{trend}% from last month
                </p>
            )}
        </div>
    );
}
