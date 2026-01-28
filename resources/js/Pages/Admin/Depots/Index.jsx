import { Head, Link, router } from "@inertiajs/react";
import AdminSidebar from "@/Components/AdminSidebar";
import {
    Store,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import { useState } from "react";

export default function DepotsIndex({ auth, depots, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedStatus, setSelectedStatus] = useState(
        filters.status || "all",
    );

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/admin/depots",
            {
                search: searchTerm,
                status: selectedStatus,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        router.get(
            "/admin/depots",
            {
                search: searchTerm,
                status: status,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Pending</span>
                </span>
            ),
            approved: (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Approved</span>
                </span>
            ),
            rejected: (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>Rejected</span>
                </span>
            ),
        };
        return badges[status] || null;
    };

    // Count depots by status
    const pendingCount = depots.data.filter(
        (d) => d.approval_status === "pending",
    ).length;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <Head title="Depot Approval" />

            {/* Sidebar */}
            <AdminSidebar currentRoute="depots" pendingCount={pendingCount} />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-brush text-gray-900 mb-2">
                            Depot Approval
                        </h1>
                        <p className="text-gray-600">
                            Kelola persetujuan registrasi depot
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="glass-card rounded-2xl p-6 mb-6">
                        {/* Status Tabs */}
                        <div className="flex flex-wrap gap-3 mb-4">
                            <button
                                onClick={() => handleStatusFilter("all")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                    selectedStatus === "all"
                                        ? "glass-button text-white shadow-lg"
                                        : "bg-white/50 text-gray-700 hover:bg-white/80"
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => handleStatusFilter("pending")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                                    selectedStatus === "pending"
                                        ? "bg-yellow-500 text-white shadow-lg"
                                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                }`}
                            >
                                <Clock className="w-4 h-4" />
                                <span>Pending</span>
                            </button>
                            <button
                                onClick={() => handleStatusFilter("approved")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                                    selectedStatus === "approved"
                                        ? "bg-green-500 text-white shadow-lg"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>Approved</span>
                            </button>
                            <button
                                onClick={() => handleStatusFilter("rejected")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                                    selectedStatus === "rejected"
                                        ? "bg-red-500 text-white shadow-lg"
                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                }`}
                            >
                                <XCircle className="w-4 h-4" />
                                <span>Rejected</span>
                            </button>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama depot atau pemilik..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                        </form>
                    </div>

                    {/* Depots Table */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        {depots.data.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nama Depot
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pemilik
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Lokasi
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal Daftar
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/50 divide-y divide-gray-200">
                                            {depots.data.map((depot) => (
                                                <tr
                                                    key={depot.ID_Mitra}
                                                    className="hover:bg-white/80 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">
                                                            {depot.Nama_Mitra}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {depot.Email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                        <div>
                                                            {depot.Pemilik}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {depot.No_HP}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        <div>
                                                            {
                                                                depot.kelurahan
                                                                    ?.Nama_Kel
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                depot.kelurahan
                                                                    ?.kecamatan
                                                                    ?.Nama_Kecamatan
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                        {new Date(
                                                            depot.created_at,
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(
                                                            depot.approval_status,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <Link
                                                            href={`/admin/depots/${depot.ID_Mitra}`}
                                                            className="inline-flex items-center px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium"
                                                        >
                                                            Review
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {depots.links.length > 3 && (
                                    <div className="px-6 py-4 border-t border-gray-200 bg-white/30">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                Showing {depots.from} to{" "}
                                                {depots.to} of {depots.total}{" "}
                                                results
                                            </div>
                                            <div className="flex space-x-2">
                                                {depots.links.map(
                                                    (link, index) => (
                                                        <Link
                                                            key={index}
                                                            href={
                                                                link.url || "#"
                                                            }
                                                            className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                                                link.active
                                                                    ? "glass-button text-white"
                                                                    : link.url
                                                                      ? "bg-white/50 text-gray-700 hover:bg-white/80"
                                                                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            }`}
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Tidak Ada Depot
                                </h3>
                                <p className="text-gray-600">
                                    {selectedStatus === "pending"
                                        ? "Tidak ada depot yang menunggu approval"
                                        : "Tidak ada depot yang ditemukan"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
