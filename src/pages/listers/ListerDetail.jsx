import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getListerById, deleteLister, blockLister, unblockLister } from "@/api/users";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ReasonModal } from "@/components/ui/ReasonModal";
import { DetailSkeleton } from "@/components/ui/PageSkeleton";
import { ArrowLeft, UserX, UserCheck, Trash2, Mail, Calendar, Home } from "lucide-react";

export default function ListerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [blockModal, setBlockModal] = useState(false);
    const [unblockModal, setUnblockModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const { data: lister, isLoading } = useQuery({
        queryKey: ["lister", id],
        queryFn: () => getListerById(id).then((r) => r.data?.lister || r.data?.user || r.data),
        retry: false,
    });

    const blockMutation = useMutation({
        mutationFn: (reason) => blockLister(id, reason),
        onSuccess: () => {
            toast.success("Lister blocked successfully");
            queryClient.invalidateQueries({ queryKey: ["lister", id] });
            queryClient.invalidateQueries({ queryKey: ["listers"] });
            setBlockModal(false);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to block lister"),
    });

    const unblockMutation = useMutation({
        mutationFn: () => unblockLister(id),
        onSuccess: () => {
            toast.success("Lister unblocked successfully");
            queryClient.invalidateQueries({ queryKey: ["lister", id] });
            queryClient.invalidateQueries({ queryKey: ["listers"] });
            setUnblockModal(false);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to unblock lister"),
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteLister(id),
        onSuccess: () => {
            toast.success("Lister deleted");
            queryClient.invalidateQueries({ queryKey: ["listers"] });
            navigate("/listers");
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete lister"),
    });

    if (isLoading) return <DetailSkeleton />;
    if (!lister) return (
        <div className="text-center py-20 text-muted-foreground">
            Lister not found.
            <button onClick={() => navigate("/listers")} className="ml-2 text-primary underline">Go back</button>
        </div>
    );

    const isBlocked = lister.is_blocked || lister.status === "blocked";
    const status = isBlocked ? "blocked" : lister.is_active ? "active" : "unverified";

    return (
        <div className="space-y-6 max-w-3xl">
            <button
                onClick={() => navigate("/listers")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Listers
            </button>

            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center text-xl font-bold text-emerald-400">
                            {lister.full_name?.charAt(0)?.toUpperCase() || "L"}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">{lister.full_name || "Unknown"}</h2>
                            <p className="text-sm text-muted-foreground">{lister.email}</p>
                        </div>
                    </div>
                    <StatusBadge status={status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {[
                        { icon: Mail, label: "Email", value: lister.email },
                        { icon: Home, label: "Total Listings", value: lister.total_listings ?? "—" },
                        { icon: Calendar, label: "Joined", value: lister.date_joined ? new Date(lister.date_joined).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                        { label: "KYC Status", value: <StatusBadge status={lister.kyc_status || "pending"} /> },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3 py-3 border-b border-border last:border-0 sm:last:border-0">
                            {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                            <div>
                                <p className="text-muted-foreground text-xs">{label}</p>
                                <p className="text-foreground font-medium">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {isBlocked && lister.block_reason && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-xs text-red-400 font-medium mb-0.5">Block Reason</p>
                        <p className="text-sm text-foreground">{lister.block_reason}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-3">
                {isBlocked ? (
                    <button
                        onClick={() => setUnblockModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                        <UserCheck className="w-4 h-4" /> Unblock Lister
                    </button>
                ) : (
                    <button
                        onClick={() => setBlockModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                    >
                        <UserX className="w-4 h-4" /> Block Lister
                    </button>
                )}
                <button
                    onClick={() => setDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                    <Trash2 className="w-4 h-4" /> Delete Lister
                </button>
            </div>

            <ReasonModal
                open={blockModal}
                onClose={() => setBlockModal(false)}
                onSubmit={(reason) => blockMutation.mutate(reason)}
                title="Block Lister"
                description="Provide a reason for blocking this lister. Their listings will be hidden from the platform."
                submitLabel="Block Lister"
                isLoading={blockMutation.isPending}
            />
            <ConfirmModal
                open={unblockModal}
                onClose={() => setUnblockModal(false)}
                onConfirm={() => unblockMutation.mutate()}
                title="Unblock Lister"
                description="This will restore the lister's access and make their listings visible again."
                confirmLabel="Unblock"
                variant="default"
                isLoading={unblockMutation.isPending}
            />
            <ConfirmModal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={() => deleteMutation.mutate()}
                title="Delete Lister"
                description="This is permanent. All lister data and their property listings will be removed."
                confirmLabel="Delete"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
