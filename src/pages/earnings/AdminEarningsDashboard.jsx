import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from "recharts";
import {
    TrendingUp, Users, Wallet,
    AlertCircle, Loader2, IndianRupee
} from "lucide-react";
import { getEarningsStats } from "@/api/earnings";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

export default function AdminEarningsDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getEarningsStats();
            setData(res.data);
        } catch (err) {
            setError("Failed to fetch earnings data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading platform earnings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground">Something went wrong</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    const avgPerBooking = data.total_bookings > 0
        ? data.total_earned / data.total_bookings
        : 0;

    const stats = [
        { label: "Total Earned", value: formatCurrency(data.total_earned), icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Total Bookings", value: data.total_bookings, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Active Listers", value: data.total_listers, icon: Users, color: "text-gray-500", bg: "bg-gray-500/10" },
        { label: "Avg Per Booking", value: formatCurrency(avgPerBooking), icon: IndianRupee, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Platform Earnings</h1>
                <p className="text-muted-foreground mt-1">All transactions across all listers</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                                <p className="text-xl font-bold text-foreground mt-0.5">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-6">Revenue Growth</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.monthly_summary}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#888888', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `₹${v / 1000}k`}
                                tick={{ fill: '#888888', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                contentStyle={{
                                    backgroundColor: '#1c1c1c',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    padding: '8px'
                                }}
                                formatter={(value) => [formatCurrency(value), "Earnings"]}
                            />
                            <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Listers Table */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold text-foreground">Earnings by Lister</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Lister Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Total Earned</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Bookings</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.lister_summary.length > 0 ? (
                                data.lister_summary.map((lister, i) => (
                                    <tr
                                        key={lister.lister_id}
                                        onClick={() => navigate(`/earnings/${lister.lister_id}`)}
                                        className={`hover:bg-muted/30 cursor-pointer transition-colors ${i % 2 === 0 ? 'bg-card' : 'bg-muted/10'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-foreground">{lister.lister_name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {lister.lister_email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-emerald-500">{formatCurrency(lister.total_earned)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground">
                                            {lister.total_bookings}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/earnings/${lister.lister_id}`);
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                                        No lister earnings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
