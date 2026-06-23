import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getUsers } from "@/api/users";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Eye } from "lucide-react";

const columns = (navigate) => [
    {
        accessorKey: "id",
        header: "#",
        cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.index + 1}</span>,
        enableSorting: false,
    },
    {
        accessorKey: "full_name",
        header: "Name",
        cell: ({ getValue }) => (
            <span className="font-medium text-foreground">{getValue() || "—"}</span>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.is_blocked ? "blocked" : row.original.is_active ? "active" : "unverified";
            return <StatusBadge status={status} />;
        },
    },
    {
        accessorKey: "date_joined",
        header: "Joined",
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
                onClick={() => navigate(`/users/${row.original.id || row.original._id}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
                <Eye className="w-3.5 h-3.5" />
                View
            </button>
        ),
    },
];

export default function UserList() {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers().then((r) => r.data?.results || r.data?.users || r.data || []),
        retry: false,
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-foreground">User Management</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Manage all registered users</p>
            </div>
            <DataTable
                data={data || []}
                columns={columns(navigate)}
                isLoading={isLoading}
                searchPlaceholder="Search by name or email..."
            />
        </div>
    );
}
