import { Head, router } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import Pagination from "@/Components/Pagination";
import OrderStatusBadge from "@/Components/OrderStatusBadge";
import GlassSelect from "@/Components/GlassSelect";
import { useState } from "react";
import {
    Package,
    RotateCcw,
    Calendar,
    DollarSign,
    XCircle,
    CreditCard,
    Filter,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Orders({ auth, orders, pelanggan }) {
    const [selectedTimeFilter, setSelectedTimeFilter] = useState("");

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
        setSelectedTimeFilter(value);
        router.get(
            "/dashboard/pelanggan/orders",
            {
                time_filter: value || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleReorder = async (orderId) => {
        try {
            const response = await axios.post(
                `/dashboard/pelanggan/reorder/${orderId}`,
            );

            // Open Midtrans payment popup
            window.snap.pay(response.data.snap_token, {
                onSuccess: async function (result) {
                    toast.success("Pembayaran berhasil!");

                    // Verify and update payment status
                    try {
                        await axios.post("/payment/verify-success", {
                            order_id: result.order_id,
                        });
                    } catch (error) {
                        console.error("Payment verification error:", error);
                    }

                    router.reload();
                },
                onPending: function (result) {
                    toast.info("Menunggu pembayaran...");
                    router.reload();
                },
                onError: function (result) {
                    toast.error("Pembayaran gagal!");
                },
                onClose: function () {
                    toast("Popup pembayaran ditutup");
                },
            });
        } catch (error) {
            toast.error("Gagal membuat pesanan ulang");
            console.error(error);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
            return;
        }

        try {
            await axios.post(`/dashboard/pelanggan/order/${orderId}/cancel`);
            toast.success("Pesanan berhasil dibatalkan");
            router.reload();
        } catch (error) {
            toast.error("Gagal membatalkan pesanan");
            console.error(error);
        }
    };

    const handleContinuePayment = async (orderId) => {
        try {
            const response = await axios.post(
                `/dashboard/pelanggan/order/${orderId}/continue-payment`,
            );

            // Open Midtrans payment popup with existing token
            window.snap.pay(response.data.snap_token, {
                onSuccess: async function (result) {
                    toast.success("Pembayaran berhasil!");

                    // Verify and update payment status
                    try {
                        await axios.post("/payment/verify-success", {
                            order_id: result.order_id,
                        });
                    } catch (error) {
                        console.error("Payment verification error:", error);
                    }

                    router.reload();
                },
                onPending: function (result) {
                    toast.info("Menunggu pembayaran...");
                    router.reload();
                },
                onError: function (result) {
                    toast.error("Pembayaran gagal!");
                },
                onClose: function () {
                    toast("Popup pembayaran ditutup");
                },
            });
        } catch (error) {
            toast.error(
                "Token pembayaran tidak tersedia atau sudah kadaluarsa",
            );
            console.error(error);
        }
    };

    const getPaymentStatusBadge = (status) => {
        const config = {
            Paid: {
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

        const { bg, text, label } = config[status] || config["Pending"];

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

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Head title="Pesanan Saya" />

            {/* Sidebar */}
            <Sidebar currentRoute="orders" />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-brush text-gray-900 mb-2">
                            Pesanan Saya
                        </h1>
                        <p className="text-gray-600">
                            Lihat riwayat dan status pesanan Anda
                        </p>
                    </div>

                    {/* Filter */}
                    <div className="glass-card rounded-2xl p-6 mb-6 relative z-50">
                        <div className="flex items-center space-x-2 mb-4">
                            <Filter className="w-5 h-5 text-water-500" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Filter Waktu
                            </h3>
                        </div>
                        <div className="max-w-xs relative z-50">
                            <GlassSelect
                                label="Periode"
                                value={selectedTimeFilter}
                                onChange={handleTimeFilterChange}
                                options={timeFilterOptions}
                                placeholder="Semua Waktu"
                            />
                        </div>
                    </div>

                    {/* Orders List */}
                    {orders.data && orders.data.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {orders.data.map((order) => (
                                    <div
                                        key={order.ID_Pesanan}
                                        className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            {/* Left side - Order info */}
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
                                                                order.produk
                                                                    ?.mitra
                                                                    ?.Nama_Mitra
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
                                                            <div className="flex items-center space-x-1">
                                                                <DollarSign className="w-4 h-4" />
                                                                <span className="font-semibold text-water-600">
                                                                    {formatPrice(
                                                                        order.Harga,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-500">
                                                                Jumlah:{" "}
                                                                {order.Jumlah}x
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right side - Status and actions */}
                                            <div className="flex flex-col items-end space-y-3">
                                                <div className="flex flex-col items-end space-y-2">
                                                    <OrderStatusBadge
                                                        status={
                                                            order.Status_Pesanan
                                                        }
                                                    />
                                                    {getPaymentStatusBadge(
                                                        order.Status_Pembayaran,
                                                    )}
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex flex-wrap gap-2 justify-end">
                                                    {/* View Invoice - for paid orders */}
                                                    {order.Status_Pembayaran ===
                                                        "Paid" &&
                                                        order.invoice && (
                                                            <a
                                                                href={`/dashboard/pelanggan/invoices/${order.invoice.hashed_id}/view`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
                                                            >
                                                                <span>
                                                                    Lihat
                                                                    Invoice
                                                                </span>
                                                            </a>
                                                        )}

                                                    {/* Continue Payment - for pending payments with snap token */}
                                                    {order.Status_Pembayaran ===
                                                        "Pending" &&
                                                        order.snap_token && (
                                                            <button
                                                                onClick={() =>
                                                                    handleContinuePayment(
                                                                        order.ID_Pesanan,
                                                                    )
                                                                }
                                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
                                                            >
                                                                <CreditCard className="w-4 h-4" />
                                                                <span>
                                                                    Lanjutkan
                                                                    Pembayaran
                                                                </span>
                                                            </button>
                                                        )}

                                                    {/* Cancel Order - for pending payments */}
                                                    {order.Status_Pembayaran ===
                                                        "Pending" && (
                                                        <button
                                                            onClick={() =>
                                                                handleCancelOrder(
                                                                    order.ID_Pesanan,
                                                                )
                                                            }
                                                            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            <span>
                                                                Cancel Pesanan
                                                            </span>
                                                        </button>
                                                    )}

                                                    {/* Reorder - for completed orders */}
                                                    {order.Status_Pesanan ===
                                                        "Selesai" && (
                                                        <button
                                                            onClick={() =>
                                                                handleReorder(
                                                                    order.ID_Pesanan,
                                                                )
                                                            }
                                                            className="flex items-center space-x-2 px-4 py-2 bg-water-500 text-white rounded-xl hover:bg-water-600 transition-colors text-sm font-medium"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                            <span>
                                                                Pesan Lagi
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                links={orders.links}
                                from={orders.from}
                                to={orders.to}
                                total={orders.total}
                            />
                        </>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum Ada Pesanan
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Mulai pesan air minum dari depot terdekat
                            </p>
                            <button
                                onClick={() =>
                                    router.visit("/dashboard/pelanggan")
                                }
                                className="glass-button px-6 py-3 rounded-xl text-white font-medium hover:scale-105 transition-transform"
                            >
                                Lihat Depot
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
