import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmLabel = "Confirm",
    variant = "danger",
    isLoading = false,
}) {
    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                    <Dialog.Close className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </Dialog.Close>

                    <div className="flex items-start gap-4">
                        <div className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                            variant === "danger" ? "bg-red-500/15" : "bg-primary/15"
                        )}>
                            <AlertTriangle className={cn(
                                "w-5 h-5",
                                variant === "danger" ? "text-red-400" : "text-primary"
                            )} />
                        </div>
                        <div className="flex-1">
                            <Dialog.Title className="text-base font-semibold text-foreground mb-1">
                                {title}
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-muted-foreground">
                                {description}
                            </Dialog.Description>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 justify-end">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2",
                                variant === "danger"
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                            )}
                        >
                            {isLoading && (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            {confirmLabel}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
