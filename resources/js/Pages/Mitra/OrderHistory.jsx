import { Head, router } from "@inertiajs/react";
import MitraSidebar from "@/Components/MitraSidebar";
import OrderStatusBadge from "@/Components/OrderStatusBadge";
import GlassSelect from "@/Components/GlassSelect";
import Pagination from "@/Components/Pagination";
import { Calendar, Package } from "lucide-react";
import { useState } from "react";

export default function OrderHistory({ auth, orders, mitra, filters, isOpen }) {
    const [timeFilter, setTimeFilter] = useState(filters.time_filter || "");
    const [status, setStatus] = useState(filters.status || "");

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleTimeFilterChange = (value) => {
        setTimeFilter(value);
        applyFilters(value, status);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        applyFilters(timeFilter, value);
    };

    const applyFilters = (time, statusValue) => {
        router.get(
            "/dashboard/mitra/orders",
            {
                time_filter: time || undefined,
                status: statusValue || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleReset = () => {
        setTimeFilter("");
        setStatus("");
        router.get("/dashboard/mitra/orders");
    };

    const handleComplete = (orderId) => {
        if (
            confirm(
                "Apakah Anda yakin ingin menandai pesanan ini sebagai selesai?",
            )
        ) {
            router.post(
                `/dashboard/mitra/order/${orderId}/complete`,
                {},
                {
                    onSuccess: () => {
                        alert("Pesanan berhasil diselesaikan!");
                    },
                    onError: () => {
                        alert(
                            "Gagal menyelesaikan pesanan. Silakan coba lagi.",
                        );
                    },
                },
            );
        }
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        const config = {
            Paid: {
                bg: "bg-green-100",
                text: "text-green-700",
                label: "Lunas",
            },
            Success: {
                bg: "bg-green-100",
                text: "text-green-700",
                label: "Lunas",
            },
            Lunas: {
                bg: "bg-green-100",
                text: "text-green-700",
                label: "Lunas",
            },
            Pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-700",
                label: "Pending",
            },
            Failed: { bg: "bg-red-100", text: "text-red-700", label: "Gagal" },
        };

        const { bg, text, label } = config[paymentStatus] || config["Pending"];

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
            >
                {label}
            </span>
        );
    };

    const timeFilterOptions = [
        { value: "", label: "Semua Waktu" },
        { value: "today", label: "Hari Ini" },
        { value: "week", label: "Minggu Ini" },
        { value: "month", label: "Bulan Ini" },
    ];

    const statusOptions = [
        { value: "", label: "Semua Status" },
        { value: "Menunggu Pembayaran", label: "Menunggu Pembayaran" },
        { value: "Diproses", label: "Diproses" },
        { value: "Selesai", label: "Selesai" },
        { value: "Dibatalkan", label: "Dibatalkan" },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Head title="Riwayat Pesanan" />

            {/* Sidebar */}
            <MitraSidebar
                currentRoute="orders"
                isOpen={isOpen}
                depotName={mitra.Nama_Mitra}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-brush text-gray-900 mb-2">
                            Riwayat Pesanan
                        </h1>
                        <p className="text-gray-600">
                            Kelola dan pantau semua pesanan Anda
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="glass-card rounded-2xl p-6 mb-6 relative z-50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Filter Pesanan
                        </h3>

                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="relative z-40">
                                <GlassSelect
                                    label="Waktu"
                                    value={timeFilter}
                                    onChange={handleTimeFilterChange}
                                    options={timeFilterOptions}
                                    placeholder="Semua Waktu"
                                />
                            </div>

                            <div className="relative z-30">
                                <GlassSelect
                                    label="Status"
                                    value={status}
                                    onChange={handleStatusChange}
                                    options={statusOptions}
                                    placeholder="Semua Status"
                                />
                            </div>

                            <div className="flex items-end md:col-span-2">
                                <button
                                    onClick={handleReset}
                                    className="glass-button w-full py-3 rounded-xl text-white font-medium hover:scale-105 transition-transform"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    {orders.data && orders.data.length > 0 ? (
                        <>
                            <div className="space-y-4 mb-6">
                                {orders.data.map((order) => (
                                    <div
                                        key={order.ID_Pesanan}
                                        className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            {/* Order Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-water-500 to-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-6 h-6 text-white" />
                                                    </div>

                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            {
                                                                order.produk
                                                                    ?.Nama_Produk
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {
                                                                order.pelanggan
                                                                    ?.Nama
                                                            }{" "}
                                                            •{" "}
                                                            {
                                                                order.pelanggan
                                                                    ?.No_HP
                                                            }
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                                            <div className="flex items-center space-x-1">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>
                                                                    {formatDate(
                                                                        order.Tanggal_Pesan,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-500">
                                                                Jumlah:{" "}
                                                                {order.Jumlah}x
                                                            </span>
                                                            <span className="font-semibold text-water-600">
                                                                {formatPrice(
                                                                    order.Harga,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="flex flex-col items-end space-y-2">
                                                <OrderStatusBadge
                                                    status={
                                                        order.Status_Pesanan
                                                    }
                                                />
                                                {getPaymentStatusBadge(
                                                    order.Status_Pembayaran,
                                                )}

                                                {/* Action buttons */}
                                                <div className="flex flex-col gap-2 mt-2">
                                                    {/* View Invoice button for paid orders */}
                                                    {(order.Status_Pembayaran ===
                                                        "Paid" ||
                                                        order.Status_Pembayaran ===
                                                            "Lunas") &&
                                                        order.invoice && (
                                                            <a
                                                                href={`/dashboard/mitra/invoices/${order.invoice.hashed_id}/view`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors text-sm text-center"
                                                            >
                                                                Lihat Invoice
                                                            </a>
                                                        )}

                                                    {/* Complete button for orders being processed */}
                                                    {order.Status_Pesanan ===
                                                        "Diproses Depot" && (
                                                        <button
                                                            onClick={() =>
                                                                handleComplete(
                                                                    order.ID_Pesanan,
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors text-sm"
                                                        >
                                                            Selesai
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination paginationData={orders} />
                        </>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Tidak Ada Pesanan
                            </h3>
                            <p className="text-gray-600">
                                Belum ada riwayat pesanan dengan filter yang
                                dipilih
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
