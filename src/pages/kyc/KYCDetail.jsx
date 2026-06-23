import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getKYCById, approveKYC, rejectKYC } from "@/api/kyc";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ReasonModal } from "@/components/ui/ReasonModal";
import { DetailSkeleton } from "@/components/ui/PageSkeleton";
import { ArrowLeft, CheckCircle, XCircle, User, Hash, Calendar, ImageOff } from "lucide-react";

function AadharImage({ url, label }) {
    const [imgError, setImgError] = useState(false);
    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
            <div className="aspect-[1.58/1] bg-muted/30 border border-border rounded-xl overflow-hidden">
                {url && !imgError ? (
                    <img
                        src={url}
                        alt={label}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ImageOff className="w-8 h-8" />
                        <span className="text-xs">Image unavailable</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function KYCDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [approveModal, setApproveModal] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);

    const { data: kyc, isLoading } = useQuery({
        queryKey: ["kyc", id],
        queryFn: () => getKYCById(id).then((r) => r.data?.kyc || r.data),
        retry: false,
    });

    const approveMutation = useMutation({
        mutationFn: () => approveKYC(id),
        onSuccess: () => {
            toast.success("KYC approved successfully");
            queryClient.invalidateQueries({ queryKey: ["kyc"] });
            queryClient.invalidateQueries({ queryKey: ["kyc", id] });
            queryClient.invalidateQueries({ queryKey: ["kyc-pending-count"] });
            setApproveModal(false);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to approve KYC"),
    });

    const rejectMutation = useMutation({
        mutationFn: (reason) => rejectKYC(id, reason),
        onSuccess: () => {
            toast.success("KYC rejected");
            queryClient.invalidateQueries({ queryKey: ["kyc"] });
            queryClient.invalidateQueries({ queryKey: ["kyc", id] });
            queryClient.invalidateQueries({ queryKey: ["kyc-pending-count"] });
            setRejectModal(false);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to reject KYC"),
    });

    if (isLoading) return <DetailSkeleton />;
    if (!kyc) return (
        <div className="text-center py-20 text-muted-foreground">
            KYC record not found.
            <button onClick={() => navigate("/kyc")} className="ml-2 text-primary underline">Go back</button>
        </div>
    );

    // Show action buttons whenever KYC is submitted and not yet approved
    const isActionable = kyc.is_kyc_submitted && kyc.kyc_status !== "approved";
    const frontImage = kyc.aadhar_front_url;
    const backImage = kyc.aadhar_back_url;

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Back */}
            <button
                onClick={() => navigate("/kyc")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to KYC
            </button>

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">KYC Review</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Identity verification details</p>
                </div>
                <StatusBadge status={kyc.kyc_status} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Applicant Info */}
                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">Applicant Details</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                            {(kyc.full_name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{kyc.full_name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground truncate">{kyc.email || "—"}</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <Hash className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-muted-foreground text-xs">Aadhar Number</p>
                                <p className="font-mono font-medium text-foreground">
                                    {kyc.aadhar_number || "—"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-muted-foreground text-xs">Submitted</p>
                                <p className="font-medium text-foreground">
                                    {kyc.kyc_submitted_at ? new Date(kyc.kyc_submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                                </p>
                            </div>
                        </div>
                        {kyc.kyc_verified_at && (
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-muted-foreground text-xs">Reviewed</p>
                                    <p className="font-medium text-foreground">
                                        {new Date(kyc.kyc_verified_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {kyc.kyc_rejection_reason && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-xs text-red-400 font-medium mb-0.5">Rejection Reason</p>
                            <p className="text-sm text-foreground">{kyc.kyc_rejection_reason}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {isActionable && (
                        <div className="pt-2 space-y-2">
                            <button
                                onClick={() => setApproveModal(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                            >
                                <CheckCircle className="w-4 h-4" /> Approve KYC
                            </button>
                            <button
                                onClick={() => setRejectModal(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                            >
                                <XCircle className="w-4 h-4" /> Reject KYC
                            </button>
                        </div>
                    )}
                </div>

                {/* Aadhar Images — side by side */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Aadhar Card Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <AadharImage url={frontImage} label="Front Side" />
                        <AadharImage url={backImage} label="Back Side" />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                open={approveModal}
                onClose={() => setApproveModal(false)}
                onConfirm={() => approveMutation.mutate()}
                title="Approve KYC"
                description="This will verify the applicant's identity and grant them full lister access on the platform."
                confirmLabel="Approve"
                variant="default"
                isLoading={approveMutation.isPending}
            />
            <ReasonModal
                open={rejectModal}
                onClose={() => setRejectModal(false)}
                onSubmit={(reason) => rejectMutation.mutate(reason)}
                title="Reject KYC"
                description="Provide a clear reason for rejecting this KYC submission. The applicant will be notified."
                submitLabel="Reject KYC"
                isLoading={rejectMutation.isPending}
            />
        </div>
    );
}
