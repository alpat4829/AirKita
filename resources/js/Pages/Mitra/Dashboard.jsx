import { Head } from "@inertiajs/react";
import MitraSidebar from "@/Components/MitraSidebar";
import StatisticsCard from "@/Components/StatisticsCard";
import SimpleBarChart from "@/Components/SimpleBarChart";
import IncomingOrderCard from "@/Components/IncomingOrderCard";
import {
    DollarSign,
    TrendingUp,
    Package,
    CheckCircle,
    Clock,
    ShoppingBag,
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
            return `Rp ${(price / 1000000).toFixed(1)}jt`;
        } else if (price >= 1000) {
            return `Rp ${(price / 1000).toFixed(0)}rb`;
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
                            <SimpleBarChart
                                data={chartData}
                                dataKey="revenue"
                                label="Pendapatan"
                                formatValue={formatPriceShort}
                            />
                        </div>

                        {/* Orders Chart */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                                <span>Pesanan 7 Hari Terakhir</span>
                            </h3>
                            <SimpleBarChart
                                data={chartData}
                                dataKey="orders"
                                label="Pesanan"
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
