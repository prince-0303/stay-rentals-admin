import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getChartData } from "@/api/dashboard";
import { KPICard } from "@/components/ui/KPICard";
import { Users, UserCheck, FileText, TrendingUp } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";

const PIE_COLORS = {
    approved: "#10b981",
    pending: "#f59e0b",
    rejected: "#ef4444",
    "not submitted": "#9ca3af",
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
                <p className="text-muted-foreground mb-1">{label}</p>
                {payload.map((p) => (
                    <p key={p.name} style={{ color: p.color }} className="font-medium">
                        {p.name}: {p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Dashboard() {
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => getDashboardStats().then((r) => r.data),
        retry: false,
    });

    const { data: chartData, isLoading: chartLoading } = useQuery({
        queryKey: ["dashboard-charts"],
        queryFn: () => getChartData().then((r) => r.data),
        retry: false,
    });

    const stats = statsData || {};
    const growth = chartData?.userGrowth || chartData?.user_growth || [];
    const kycBreakdown = chartData?.kycBreakdown || chartData?.kyc_breakdown || [];

    // Normalize KYC breakdown for pie chart
    const pieData = kycBreakdown.length
        ? kycBreakdown
        : [
            { name: "Approved", value: stats.approved_kyc || 0 },
            { name: "Pending", value: stats.pending_kyc || 0 },
            { name: "Rejected", value: stats.rejected_kyc || 0 },
            { name: "Not Submitted", value: stats.not_submitted_kyc || 0 },
        ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-xl font-bold text-foreground">Overview</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Platform statistics and activity</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Users"
                    value={stats.total_users ?? stats.users}
                    icon={Users}
                    description="Registered users"
                    color="blue"
                    isLoading={statsLoading}
                />
                <KPICard
                    title="Total Listers"
                    value={stats.total_listers ?? stats.listers}
                    icon={UserCheck}
                    description="Property listers"
                    color="emerald"
                    isLoading={statsLoading}
                />
                <KPICard
                    title="Pending KYC"
                    value={stats.pending_kyc ?? stats.pending}
                    icon={FileText}
                    description="Awaiting review"
                    color="amber"
                    isLoading={statsLoading}
                />
                <KPICard
                    title="Approved KYC"
                    value={stats.approved_kyc ?? stats.approved}
                    icon={TrendingUp}
                    description="Verified accounts"
                    color="purple"
                    isLoading={statsLoading}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* User Growth Line Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">User Growth</h3>
                    {chartLoading ? (
                        <div className="h-56 bg-muted/30 rounded-lg animate-pulse" />
                    ) : growth.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={growth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 34% 22%)" />
                                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
                                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} name="Users" />
                                <Line type="monotone" dataKey="listers" stroke="#10b981" strokeWidth={2} dot={false} name="Listers" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
                            No chart data available
                        </div>
                    )}
                </div>

                {/* KYC Status Pie Chart */}
                <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">KYC Status</h3>
                    {chartLoading ? (
                        <div className="h-56 bg-muted/30 rounded-lg animate-pulse" />
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    dataKey="value"
                                    paddingAngle={3}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={PIE_COLORS[entry.name?.toLowerCase()] || "#6b7280"}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    formatter={(value) => <span style={{ color: "#94a3b8", fontSize: 11 }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
