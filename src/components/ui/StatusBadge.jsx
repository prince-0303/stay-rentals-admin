import { cn } from "@/lib/utils";

const statusConfig = {
    active: { label: "Active", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    blocked: { label: "Blocked", className: "bg-red-500/15 text-red-400 border-red-500/30" },
    pending: { label: "Pending", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    approved: { label: "Approved", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    rejected: { label: "Rejected", className: "bg-red-500/15 text-red-400 border-red-500/30" },
    verified: { label: "Verified", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    unverified: { label: "Unverified", className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
    not_submitted: { label: "Not Submitted", className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
};

export function StatusBadge({ status }) {
    const config = statusConfig[status?.toLowerCase()] || {
        label: status || "Unknown",
        className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                config.className
            )}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
            {config.label}
        </span>
    );
}
