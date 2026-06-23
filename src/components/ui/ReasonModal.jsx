import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

const schema = z.object({
    reason: z.string().min(10, "Reason must be at least 10 characters").max(500, "Reason is too long"),
});

export function ReasonModal({
    open,
    onClose,
    onSubmit,
    title = "Provide a Reason",
    description = "Please provide a reason for this action.",
    submitLabel = "Submit",
    isLoading = false,
}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleFormSubmit = (data) => {
        onSubmit(data.reason);
        reset();
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                    <Dialog.Close className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </Dialog.Close>

                    <Dialog.Title className="text-base font-semibold text-foreground mb-1">
                        {title}
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-muted-foreground mb-4">
                        {description}
                    </Dialog.Description>

                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Reason <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                {...register("reason")}
                                rows={4}
                                placeholder="Enter your reason here..."
                                className="w-full rounded-lg bg-background border border-input text-foreground text-sm px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            />
                            {errors.reason && (
                                <p className="text-red-400 text-xs mt-1">{errors.reason.message}</p>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading && (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {submitLabel}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
