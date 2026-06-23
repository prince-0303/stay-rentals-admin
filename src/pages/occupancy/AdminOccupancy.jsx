import { useState, useEffect } from "react";
import {
    Home, User, Search,
    AlertCircle, Loader2, MapPin,
    Mail, CreditCard, Calendar
} from "lucide-react";
import { getOccupancyData } from "@/api/occupancy";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

export default function AdminOccupancy() {
    const [view, setView] = useState("properties");
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (currentView) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getOccupancyData(currentView);
            setData(res.data.data || []);
        } catch (err) {
            setError("Failed to fetch occupancy data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(view);
    }, [view]);

    const filteredData = data.filter((item) => {
        const search = searchTerm.toLowerCase();
        if (view === "properties") {
            return (
                item.property_title?.toLowerCase().includes(search) ||
                item.city?.toLowerCase().includes(search) ||
                item.lister_name?.toLowerCase().includes(search) ||
                item.booked_by?.user_email?.toLowerCase().includes(search)
            );
        } else {
            return (
                item.user_name?.toLowerCase().includes(search) ||
                item.user_email?.toLowerCase().includes(search) ||
                item.booked_properties?.some(p => p.property_title?.toLowerCase().includes(search))
            );
        }
    });

    const SkeletonCard = () => (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
            <div className="border-t border-border pt-4">
                <div className="h-20 bg-muted/30 rounded"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pb-10">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">Occupancy Overview</h1>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 shadow-sm">
                        {loading ? "..." : `${data.length} ${view === "properties" ? "Properties" : "Users"}`}
                    </span>
                </div>
                <p className="text-muted-foreground mt-1">Track which users are in which properties</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-border">
                {["properties", "users"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setView(tab);
                            setSearchTerm("");
                        }}
                        className={`pb-3 text-sm font-bold capitalize transition-all relative ${view === tab
                                ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {tab === "properties" ? <Home className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            {tab}
                        </div>
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search by title, city, email or host..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-11 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Failed to Load Content</h3>
                    <p className="text-muted-foreground mt-1 mb-6">{error}</p>
                    <button
                        onClick={() => fetchData(view)}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card border border-border border-dashed rounded-xl">
                    {view === "properties" ? <Home className="w-12 h-12 mb-4 opacity-20" /> : <User className="w-12 h-12 mb-4 opacity-20" />}
                    <p className="font-medium">{view === "properties" ? "No booked properties yet" : "No bookings found"}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.map((item) => (
                        <div key={view === "properties" ? item.property_id : item.user_id} className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border-b-4 border-b-primary/10">
                            {view === "properties" ? (
                                <>
                                    <div className="p-6 pb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                                                <Home className="w-4 h-4 text-primary" />
                                                {item.property_title}
                                            </h3>
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded border border-border">
                                                <MapPin className="w-3 h-3" />
                                                {item.city}, {item.state}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 mt-4">
                                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span className="font-bold text-foreground/70 uppercase">Lister:</span>
                                                {item.lister_name} · {item.lister_email}
                                            </p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span className="font-bold text-foreground/70 uppercase">Rent:</span>
                                                <span className="text-foreground font-black">{formatCurrency(item.rent_price)}/month</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mx-6 mb-6 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-500">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider mb-1">Booked By</p>
                                                <p className="text-sm font-black text-foreground truncate">{item.booked_by.user_name}</p>
                                                <p className="text-xs text-muted-foreground truncate mb-2">{item.booked_by.user_email}</p>
                                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-emerald-500/5">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Paid</p>
                                                        <p className="text-sm font-black text-emerald-600">{formatCurrency(item.booked_by.amount_paid)}</p>
                                                    </div>
                                                    <div className="h-6 w-px bg-emerald-500/10"></div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Date</p>
                                                        <p className="text-sm font-bold text-foreground/70">{formatDate(item.booked_by.paid_at)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-lg">
                                            {item.user_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-foreground uppercase tracking-tight leading-none">{item.user_name}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">{item.user_email}</p>
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
                                        {item.booked_properties?.length || 0} Properties Booked
                                    </div>

                                    <div className="space-y-3">
                                        {item.booked_properties?.map((prop, idx) => (
                                            <div key={idx} className="bg-primary/5 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div>
                                                        <h4 className="text-sm font-black text-foreground mb-0.5">{prop.property_title}</h4>
                                                        <p className="text-xs text-muted-foreground">{prop.city}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-emerald-600">{formatCurrency(prop.amount_paid)}</p>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{formatDate(prop.paid_at)}</p>
                                                    </div>
                                                </div>
                                                <div className="pt-2 border-t border-primary/5 flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                                                    <span className="text-foreground/50">Lister:</span>
                                                    {prop.lister_name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
