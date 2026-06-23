import { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function DataTable({
    data = [],
    columns = [],
    isLoading = false,
    searchPlaceholder = "Search...",
    filterComponent,
}) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    if (isLoading) {
        return (
            <div className="space-y-3 animate-pulse">
                <div className="flex gap-3 mb-4">
                    <div className="h-9 bg-muted rounded-lg flex-1 max-w-sm" />
                </div>
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-border">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-muted rounded" />)}
                    </div>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-border last:border-0">
                            {[...Array(4)].map((_, j) => <div key={j} className="h-4 bg-muted rounded" />)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                {filterComponent}
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b border-border bg-muted/30">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap"
                                            onClick={header.column.getToggleSortingHandler()}
                                            style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    <span className="text-muted-foreground/50">
                                                        {header.column.getIsSorted() === "asc" ? (
                                                            <ChevronUp className="w-3.5 h-3.5" />
                                                        ) : header.column.getIsSorted() === "desc" ? (
                                                            <ChevronDown className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <ChevronsUpDown className="w-3.5 h-3.5" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        No results found.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-4 py-3 text-foreground">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1} —{" "}
                        {table.getFilteredRowModel().rows.length} total
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-1.5 rounded-md hover:bg-accent text-foreground disabled:opacity-40 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(table.getPageCount(), 5) }, (_, i) => {
                            const pageNum = i;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => table.setPageIndex(pageNum)}
                                    className={cn(
                                        "w-8 h-8 text-sm rounded-md transition-colors",
                                        table.getState().pagination.pageIndex === pageNum
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-accent text-foreground"
                                    )}
                                >
                                    {pageNum + 1}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-1.5 rounded-md hover:bg-accent text-foreground disabled:opacity-40 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
