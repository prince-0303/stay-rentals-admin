import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllKYC } from "@/api/kyc";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Eye } from "lucide-react";

const TABS = ["all", "pending", "approved", "rejected", "not_submitted"];

const columns = (navigate) => [
    {
        accessorKey: "id",
        header: "#",
        cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.index + 1}</span>,
        enableSorting: false,
    },
    {
        accessorKey: "full_name",
        header: "Applicant",
        cell: ({ row, getValue }) => (
            <div>
                <p className="font-medium text-foreground">{getValue() || "—"}</p>
                <p className="text-xs text-muted-foreground">{row.original.email || ""}</p>
            </div>
        ),
    },
    {
        accessorKey: "aadhar_number",
        header: "Aadhar No.",
        cell: ({ getValue }) => {
            const val = getValue();
            if (!val) return <span className="text-muted-foreground">—</span>;
            // mask middle digits
            const masked = val.replace(/(\d{4})\d{4}(\d{4})/, "$1 XXXX $2");
            return <span className="font-mono text-sm">{masked}</span>;
        },
    },
    {
        accessorKey: "kyc_status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    },
    {
        accessorKey: "kyc_submitted_at",
        header: "Submitted",
        cell: ({ getValue }) => {
            const v = getValue();
            return <span className="text-muted-foreground text-xs">{v ? new Date(v).toLocaleDateString() : "—"}</span>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
            <button
                onClick={() => navigate(`/kyc/${row.original.id}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
                <Eye className="w-3.5 h-3.5" />
                Review
            </button>
        ),
    },
];

export default function KYCList() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");

    const { data: allData, isLoading } = useQuery({
        queryKey: ["kyc"],
        queryFn: () => getAllKYC().then((r) => r.data?.kyc_list || []),
        retry: false,
    });

    const tabCounts = {
        all: allData?.length || 0,
        pending: allData?.filter((k) => k.kyc_status === "pending").length || 0,
        approved: allData?.filter((k) => k.kyc_status === "approved").length || 0,
        rejected: allData?.filter((k) => k.kyc_status === "rejected").length || 0,
        not_submitted: allData?.filter((k) => k.kyc_status === "not_submitted").length || 0,
    };

    const filtered = activeTab === "all"
        ? allData || []
        : (allData || []).filter((k) => k.kyc_status === activeTab);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-foreground">KYC Management</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Review and approve identity verification requests</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted/30 rounded-lg p-1 w-fit border border-border">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${activeTab === tab
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                        {tabCounts[tab] > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === "pending"
                                ? "bg-amber-500/20 text-amber-400"
                                : tab === "approved"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : tab === "rejected"
                                        ? "bg-red-500/20 text-red-400"
                                        : tab === "not_submitted"
                                            ? "bg-gray-500/20 text-gray-400"
                                            : "bg-muted text-muted-foreground"
                                }`}>
                                {tabCounts[tab]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <DataTable
                data={filtered}
                columns={columns(navigate)}
                isLoading={isLoading}
                searchPlaceholder="Search by name or Aadhar number..."
            />
        </div>
    );
}
