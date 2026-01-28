import { Head, Link, router } from "@inertiajs/react";
import AdminSidebar from "@/Components/AdminSidebar";
import StatisticsCard from "@/Components/StatisticsCard";
import {
    ShoppingBag,
    DollarSign,
    Filter,
    Download,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    Package,
} from "lucide-react";
import { useState } from "react";

export default function OrdersIndex({ auth, orders, stats, depots, filters }) {
    const [filterState, setFilterState] = useState({
        depot_id: filters.depot_id || "",
        status: filters.status || "",
        payment_method: filters.payment_method || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filterState, [key]: value };
        setFilterState(newFilters);
    };

    const applyFilters = () => {
        router.get("/admin/orders", filterState, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        const emptyFilters = {
            depot_id: "",
            status: "",
            payment_method: "",
            date_from: "",
            date_to: "",
        };
        setFilterState(emptyFilters);
        router.get("/admin/orders", emptyFilters, {
            preserveState: true,
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status) => {
        const badges = {
            "Menunggu Konfirmasi": (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    Pending
                </span>
            ),
            Diterima: (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Diterima
                </span>
            ),
            Selesai: (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Selesai
                </span>
            ),
            Dibatalkan: (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    Dibatalkan
                </span>
            ),
            Ditolak: (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    Ditolak
                </span>
            ),
        };
        return (
            badges[status] || (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {status}
                </span>
            )
        );
    };

    const getPaymentBadge = (method) => {
        const badges = {
            COD: (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                    COD
                </span>
            ),
            "E-Wallet": (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                    E-Wallet
                </span>
            ),
        };
        return (
            badges[method] || (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {method}
                </span>
            )
        );
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <Head title="Order Monitoring" />

            {/* Sidebar */}
            <AdminSidebar currentRoute="orders" />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-brush text-gray-900 mb-2">
                            Order Monitoring
                        </h1>
                        <p className="text-gray-600">
                            Pantau semua pesanan dari seluruh depot
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatisticsCard
                            icon={ShoppingBag}
                            label="Total Pesanan"
                            count={stats.total_orders}
                            color="blue"
                        />
                        <StatisticsCard
                            icon={DollarSign}
                            label="Total Revenue"
                            count={formatPrice(stats.total_revenue)}
                            color="green"
                        />
                        <StatisticsCard
                            icon={Clock}
                            label="Pending"
                            count={stats.pending}
                            color="yellow"
                        />
                        <StatisticsCard
                            icon={CheckCircle}
                            label="Selesai"
                            count={stats.completed}
                            color="emerald"
                        />
                    </div>

                    {/* Filters */}
                    <div className="glass-card rounded-2xl p-6 mb-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Filter className="w-5 h-5 text-purple-600" />
                            <h2 className="text-xl font-semibold text-gray-900">
                                Filter Pesanan
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Depot Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Depot
                                </label>
                                <select
                                    value={filterState.depot_id}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "depot_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-4 py-2 rounded-xl border-0 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                                >
                                    <option value="">Semua Depot</option>
                                    {depots.map((depot) => (
                                        <option
                                            key={depot.ID_Mitra}
                                            value={depot.ID_Mitra}
                                        >
                                            {depot.Nama_Mitra}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={filterState.status}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "status",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-4 py-2 rounded-xl border-0 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="Menunggu Konfirmasi">
                                        Menunggu Konfirmasi
                                    </option>
                                    <option value="Diterima">Diterima</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Dibatalkan">
                                        Dibatalkan
                                    </option>
                                    <option value="Ditolak">Ditolak</option>
                                </select>
                            </div>

                            {/* Payment Method Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Metode Pembayaran
                                </label>
                                <select
                                    value={filterState.payment_method}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "payment_method",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-4 py-2 rounded-xl border-0 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                                >
                                    <option value="">Semua Metode</option>
                                    <option value="COD">COD</option>
                                    <option value="E-Wallet">E-Wallet</option>
                                </select>
                            </div>

                            {/* Date From */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dari Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={filterState.date_from}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "date_from",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-4 py-2 rounded-xl border-0 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                            </div>

                            {/* Date To */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sampai Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={filterState.date_to}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "date_to",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-4 py-2 rounded-xl border-0 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex items-end space-x-2">
                                <button
                                    onClick={applyFilters}
                                    className="flex-1 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium"
                                >
                                    Terapkan
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        {orders.data.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID Pesanan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Depot
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pelanggan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pembayaran
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
                                            {orders.data.map((order) => (
                                                <tr
                                                    key={order.ID_Pesanan}
                                                    className="hover:bg-white/80 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">
                                                            #{order.ID_Pesanan}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">
                                                            {
                                                                order.mitra
                                                                    ?.Nama_Mitra
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                order.mitra
                                                                    ?.kelurahan
                                                                    ?.Nama_Kel
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-gray-900">
                                                            {
                                                                order.pelanggan
                                                                    ?.user?.name
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                        {new Date(
                                                            order.created_at,
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
                                                        <div className="font-semibold text-gray-900">
                                                            {formatPrice(
                                                                order.Harga,
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getPaymentBadge(
                                                            order.Metode_Pembayaran,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(
                                                            order.Status_Pesanan,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <Link
                                                            href={`/admin/orders/${order.ID_Pesanan}`}
                                                            className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-700 font-medium"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            <span>Detail</span>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {orders.links.length > 3 && (
                                    <div className="px-6 py-4 border-t border-gray-200 bg-white/30">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                Showing {orders.from} to{" "}
                                                {orders.to} of {orders.total}{" "}
                                                results
                                            </div>
                                            <div className="flex space-x-2">
                                                {orders.links.map(
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
                                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Tidak Ada Pesanan
                                </h3>
                                <p className="text-gray-600">
                                    Tidak ada pesanan yang sesuai dengan filter
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
