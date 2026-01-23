import { Package, Phone, MapPin, User, Clock } from "lucide-react";

export default function IncomingOrderCard({ order, onAccept, onReject }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
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
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}
            >
                {label}
            </span>
        );
    };

    return (
        <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left side - Order info */}
                <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-water-500" />
                            <span className="text-sm text-gray-600">
                                {formatTime(order.Tanggal_Pesan)}
                            </span>
                        </div>
                        {getPaymentStatusBadge(order.Status_Pembayaran)}
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold text-gray-900">
                                {order.pelanggan?.Nama}
                            </span>
                        </div>
                        <div className="flex items-start space-x-2">
                            <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-600">
                                <p>{order.pelanggan?.Alamat}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {order.pelanggan?.kelurahan?.Nama_Kel}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <span className="text-sm text-gray-600">
                                {order.pelanggan?.No_HP}
                            </span>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-water-500 to-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                    {order.produk?.Nama_Produk}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Jumlah:{" "}
                                    <span className="font-medium">
                                        {order.Jumlah}x
                                    </span>
                                </p>
                                <p className="text-lg font-brush text-water-600 mt-2">
                                    {formatPrice(order.Harga)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex md:flex-col gap-2">
                    {/* View Invoice button for paid orders */}
                    {order.Status_Pembayaran === "Paid" && (
                        <a
                            href={`/dashboard/mitra/invoices/${order.ID_Pesanan}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors text-center"
                        >
                            Lihat Invoice
                        </a>
                    )}
                    <button
                        onClick={() => onAccept(order.ID_Pesanan)}
                        disabled={order.Status_Pembayaran !== "Paid"}
                        className="flex-1 md:flex-none px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Terima
                    </button>
                    <button
                        onClick={() => onReject(order.ID_Pesanan)}
                        className="flex-1 md:flex-none px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                    >
                        Tolak
                    </button>
                </div>
            </div>
        </div>
    );
}
