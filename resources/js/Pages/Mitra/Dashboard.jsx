import { Head } from "@inertiajs/react";
import MitraSidebar from "@/Components/MitraSidebar";
import StatisticsCard from "@/Components/StatisticsCard";
import AreaLineChart from "@/Components/AreaLineChart";
import IncomingOrderCard from "@/Components/IncomingOrderCard";
import {
    DollarSign,
    TrendingUp,
    Package,
    CheckCircle,
    Clock,
    ShoppingBag,
    XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function MitraDashboard({
    auth,
    mitra,
    todayOrders,
    statistics,
    chartData,
    isOpen,
    approvalStatus,
    rejectionReason,
}) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatPriceShort = (price) => {
        if (price >= 1000000) {
            return `Rp ${(price / 1000000).toFixed(1)}M`;
        } else if (price >= 1000) {
            return `Rp ${(price / 1000).toFixed(0)}K`;
        }
        return `Rp ${price}`;
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            await axios.post(`/dashboard/mitra/order/${orderId}/accept`);
            toast.success("Pesanan diterima!");
            window.location.reload();
        } catch (error) {
            toast.error("Gagal menerima pesanan");
            console.error(error);
        }
    };

    const handleRejectOrder = async (orderId) => {
        try {
            await axios.post(`/dashboard/mitra/order/${orderId}/reject`);
            toast.success("Pesanan ditolak");
            window.location.reload();
        } catch (error) {
            toast.error("Gagal menolak pesanan");
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Head title="Dashboard Mitra" />

            {/* Sidebar */}
            <MitraSidebar
                currentRoute="dashboard"
                isOpen={isOpen}
                depotName={mitra.Nama_Mitra}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-brush text-gray-900 mb-2">
                            Statistik & Analisis
                        </h1>
                        <p className="text-gray-600">
                            Pantau performa depot Anda secara real-time
                        </p>
                    </div>

                    {/* Approval Status Banners */}
                    {approvalStatus === "pending" && (
                        <div className="glass-card rounded-2xl p-6 mb-8 border-2 border-yellow-300 bg-yellow-50/50">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <Clock className="w-8 h-8 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                                        Depot Sedang Dalam Proses Verifikasi
                                    </h3>
                                    <p className="text-yellow-800 mb-3">
                                        Depot Anda sedang ditinjau oleh admin.
                                        Anda belum dapat menggunakan fitur
                                        dashboard sampai depot disetujui.
                                    </p>
                                    <p className="text-sm text-yellow-700">
                                        Fitur yang dinonaktifkan: Buka/Tutup
                                        Depot, Kelola Produk, Terima Pesanan
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {approvalStatus === "rejected" && (
                        <div className="glass-card rounded-2xl p-6 mb-8 border-2 border-red-300 bg-red-50/50">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <XCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-red-900 mb-2">
                                        Depot Ditolak
                                    </h3>
                                    <p className="text-red-800 mb-3">
                                        Maaf, pendaftaran depot Anda ditolak
                                        oleh admin.
                                    </p>
                                    {rejectionReason && (
                                        <div className="bg-white/50 rounded-xl p-4 mb-3">
                                            <p className="text-sm font-medium text-red-900 mb-1">
                                                Alasan Penolakan:
                                            </p>
                                            <p className="text-red-800">
                                                {rejectionReason}
                                            </p>
                                        </div>
                                    )}
                                    <p className="text-sm text-red-700">
                                        Silakan hubungi admin untuk informasi
                                        lebih lanjut atau daftar ulang dengan
                                        informasi yang benar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Statistics Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatisticsCard
                            icon={DollarSign}
                            label="Total Pendapatan"
                            count={formatPrice(statistics.totalRevenue)}
                            color="green"
                        />
                        <StatisticsCard
                            icon={TrendingUp}
                            label="Pendapatan Hari Ini"
                            count={formatPrice(statistics.todayRevenue)}
                            color="blue"
                        />
                        <StatisticsCard
                            icon={Package}
                            label="Pesanan Hari Ini"
                            count={statistics.ordersToday}
                            color="purple"
                        />
                        <StatisticsCard
                            icon={ShoppingBag}
                            label="Pesanan Bulan Ini"
                            count={statistics.ordersThisMonth}
                            color="yellow"
                        />
                    </div>

                    {/* Order Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <StatisticsCard
                            icon={Clock}
                            label="Pesanan Pending"
                            count={statistics.pendingOrders}
                            color="yellow"
                        />
                        <StatisticsCard
                            icon={CheckCircle}
                            label="Pesanan Selesai"
                            count={statistics.completedOrders}
                            color="green"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Revenue Chart */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <span>Pendapatan 7 Hari Terakhir</span>
                            </h3>
                            <AreaLineChart
                                data={chartData}
                                dataKey="revenue"
                                formatValue={formatPriceShort}
                                color="green"
                            />
                        </div>

                        {/* Orders Chart */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                                <span>Pesanan 7 Hari Terakhir</span>
                            </h3>
                            <AreaLineChart
                                data={chartData}
                                dataKey="orders"
                                color="blue"
                            />
                        </div>
                    </div>

                    {/* Incoming Orders Section */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-brush text-gray-900 mb-4">
                            Pesanan Masuk Hari Ini
                        </h3>
                    </div>

                    {todayOrders.length > 0 ? (
                        <div className="space-y-4">
                            {todayOrders.map((order) => (
                                <IncomingOrderCard
                                    key={order.ID_Pesanan}
                                    order={order}
                                    onAccept={handleAcceptOrder}
                                    onReject={handleRejectOrder}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum Ada Pesanan Hari Ini
                            </h3>
                            <p className="text-gray-600">
                                Pesanan baru akan muncul di sini
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
