import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import OrderStatusBadge from "@/Components/OrderStatusBadge";
import {
    Package,
    ArrowLeft,
    RotateCcw,
    Calendar,
    DollarSign,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Orders({ auth, orders, pelanggan }) {
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

    const handleReorder = async (orderId) => {
        try {
            const response = await axios.post(
                `/dashboard/pelanggan/reorder/${orderId}`,
            );

            // Open Midtrans payment popup
            window.snap.pay(response.data.snap_token, {
                onSuccess: function (result) {
                    toast.success("Pembayaran berhasil!");
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

    const getPaymentStatusBadge = (status) => {
        const config = {
            Success: {
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.visit("/dashboard/pelanggan")}
                        className="glass-button p-2 rounded-xl text-white hover:scale-110 transition-transform"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-3xl font-brush text-gray-900">
                        Pesanan Saya
                    </h2>
                </div>
            }
        >
            <Head title="Pesanan Saya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
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
                                                            order.produk?.mitra
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
                                                    <span>Pesan Lagi</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
        </AuthenticatedLayout>
    );
}
