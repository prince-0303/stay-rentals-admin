export function PageSkeleton({ rows = 8 }) {
    return (
        <div className="space-y-3 animate-pulse">
            {/* Header skeleton */}
            <div className="h-8 bg-muted rounded w-48 mb-6" />

            {/* Table header skeleton */}
            <div className="flex gap-4 mb-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded flex-1" />
                ))}
            </div>

            {/* Row skeletons */}
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex gap-4 bg-card border border-border rounded-lg p-4">
                    <div className="h-4 bg-muted rounded w-8" />
                    <div className="h-4 bg-muted rounded flex-1" />
                    <div className="h-4 bg-muted rounded flex-1" />
                    <div className="h-4 bg-muted rounded w-20" />
                    <div className="h-4 bg-muted rounded w-16" />
                </div>
            ))}
        </div>
    );
}

export function DetailSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-full" />
                    <div className="space-y-2 flex-1">
                        <div className="h-5 bg-muted rounded w-40" />
                        <div className="h-4 bg-muted rounded w-64" />
                    </div>
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded w-full" />
                ))}
            </div>
        </div>
    );
}
