import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getUserById, deleteUser, blockUser, unblockUser } from "@/api/users";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ReasonModal } from "@/components/ui/ReasonModal";
import { DetailSkeleton } from "@/components/ui/PageSkeleton";
import { ArrowLeft, UserX, UserCheck, Trash2, Mail, Calendar, Phone } from "lucide-react";

export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [blockModal, setBlockModal] = useState(false);
    const [unblockModal, setUnblockModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const { data: user, isLoading } = useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserById(id).then((r) => r.data?.user || r.data),
        retry: false,
    });

    const blockMutation = useMutation({
        mutationFn: (reason) => blockUser(id, reason),
        onSuccess: () => {
            toast.success("User blocked successfully");
            queryClient.invalidateQueries({ queryKey: ["user", id] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setBlockModal(false);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to block user");
        },
    });

    const unblockMutation = useMutation({
        mutationFn: () => unblockUser(id),
        onSuccess: () => {
            toast.success("User unblocked successfully");
            queryClient.invalidateQueries({ queryKey: ["user", id] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setUnblockModal(false);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to unblock user");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteUser(id),
        onSuccess: () => {
            toast.success("User deleted");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            navigate("/users");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete user");
        },
    });

    if (isLoading) return <DetailSkeleton />;
    if (!user) return (
        <div className="text-center py-20 text-muted-foreground">
            User not found.
            <button onClick={() => navigate("/users")} className="ml-2 text-primary underline">Go back</button>
        </div>
    );

    const isBlocked = user.is_blocked || user.status === "blocked";
    const status = isBlocked ? "blocked" : user.is_active ? "active" : "unverified";

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Back */}
            <button
                onClick={() => navigate("/users")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Users
            </button>

            {/* User Card */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center text-xl font-bold text-primary">
                            {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">{user.full_name || "Unknown"}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <StatusBadge status={status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {[
                        { icon: Mail, label: "Email", value: user.email },
                        { icon: Phone, label: "Phone", value: user.phone_number || "—" },
                        { icon: Calendar, label: "Joined", value: user.date_joined ? new Date(user.date_joined).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                        { label: "Role", value: user.role || "user" },
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

                {isBlocked && user.block_reason && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-xs text-red-400 font-medium mb-0.5">Block Reason</p>
                        <p className="text-sm text-foreground">{user.block_reason}</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                {isBlocked ? (
                    <button
                        onClick={() => setUnblockModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                        <UserCheck className="w-4 h-4" /> Unblock User
                    </button>
                ) : (
                    <button
                        onClick={() => setBlockModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                    >
                        <UserX className="w-4 h-4" /> Block User
                    </button>
                )}
                <button
                    onClick={() => setDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                    <Trash2 className="w-4 h-4" /> Delete User
                </button>
            </div>

            {/* Modals */}
            <ReasonModal
                open={blockModal}
                onClose={() => setBlockModal(false)}
                onSubmit={(reason) => blockMutation.mutate(reason)}
                title="Block User"
                description="Provide a reason for blocking this user. This will be recorded and the user will be notified."
                submitLabel="Block User"
                isLoading={blockMutation.isPending}
            />
            <ConfirmModal
                open={unblockModal}
                onClose={() => setUnblockModal(false)}
                onConfirm={() => unblockMutation.mutate()}
                title="Unblock User"
                description="This will restore the user's access to the platform. Are you sure?"
                confirmLabel="Unblock"
                variant="default"
                isLoading={unblockMutation.isPending}
            />
            <ConfirmModal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={() => deleteMutation.mutate()}
                title="Delete User"
                description="This action is permanent and cannot be undone. All user data will be removed."
                confirmLabel="Delete"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
