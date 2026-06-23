import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, TrendingUp, Wallet,
    AlertCircle, Loader2, Calendar,
    Home, User
} from "lucide-react";
import { getListerEarningsDetail } from "@/api/earnings";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

export default function AdminListerEarningsDetail() {
    const { listerId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getListerEarningsDetail(listerId);
            setData(res.data);
        } catch (err) {
            setError("Failed to fetch lister earnings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [listerId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading lister earnings...</p>
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
                    <h3 className="text-lg font-bold text-foreground">Error Loading Details</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <button
                    onClick={fetchDetail}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <button
                onClick={() => navigate("/earnings")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Platform Earnings
            </button>

            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {data.lister.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{data.lister.name}</h1>
                    <p className="text-muted-foreground">{data.lister.email}</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-emerald-500/10">
                            <Wallet className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Earned</p>
                            <p className="text-2xl font-bold text-foreground mt-0.5">
                                {formatCurrency(data.total_earned)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-blue-500/10">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Bookings</p>
                            <p className="text-2xl font-bold text-foreground mt-0.5">
                                {data.total_bookings}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold text-foreground">Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Property</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Tenant</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.payments.length > 0 ? (
                                data.payments.map((payment, i) => (
                                    <tr
                                        key={i}
                                        className={`${i % 2 === 0 ? 'bg-card' : 'bg-muted/10'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Home className="w-4 h-4 text-muted-foreground" />
                                                <p className="font-medium text-foreground">{payment.property_title}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5" />
                                                {payment.tenant_email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-emerald-500">{formatCurrency(payment.amount)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(payment.paid_at)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">
                                        No payment history found for this lister.
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
