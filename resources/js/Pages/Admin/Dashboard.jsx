import { Head } from "@inertiajs/react";
import AdminSidebar from "@/Components/AdminSidebar";
import StatisticsCard from "@/Components/StatisticsCard";
import AreaLineChart from "@/Components/AreaLineChart";
import {
    Store,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign,
    TrendingUp,
    ShoppingBag,
    Package,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

export default function AdminDashboard({
    auth,
    stats,
    chartData,
    recentPendingDepots,
    recentOrders,
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

    // Prepare depot status pie chart data
    const depotStatusData = [
        { name: "Approved", value: stats.depots.approved, color: "#10b981" },
        { name: "Pending", value: stats.depots.pending, color: "#f59e0b" },
        { name: "Rejected", value: stats.depots.rejected, color: "#ef4444" },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <Head title="Admin Dashboard" />

            {/* Sidebar */}
            <AdminSidebar
                currentRoute="dashboard"
                pendingCount={stats.depots.pending}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-brush text-gray-900 mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Monitor dan kelola semua depot dan pesanan
                        </p>
                    </div>

                    {/* Depot Statistics */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Statistik Depot
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatisticsCard
                                icon={Store}
                                label="Total Depot"
                                count={stats.depots.total}
                                color="purple"
                            />
                            <StatisticsCard
                                icon={Clock}
                                label="Pending Approval"
                                count={stats.depots.pending}
                                color="yellow"
                            />
                            <StatisticsCard
                                icon={CheckCircle}
                                label="Approved"
                                count={stats.depots.approved}
                                color="green"
                            />
                            <StatisticsCard
                                icon={XCircle}
                                label="Rejected"
                                count={stats.depots.rejected}
                                color="red"
                            />
                        </div>
                    </div>

                    {/* Order Statistics */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Statistik Pesanan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatisticsCard
                                icon={ShoppingBag}
                                label="Pesanan Hari Ini"
                                count={stats.orders.today}
                                color="blue"
                            />
                            <StatisticsCard
                                icon={Package}
                                label="Pesanan Minggu Ini"
                                count={stats.orders.week}
                                color="indigo"
                            />
                            <StatisticsCard
                                icon={TrendingUp}
                                label="Pesanan Bulan Ini"
                                count={stats.orders.month}
                                color="purple"
                            />
                        </div>
                    </div>

                    {/* Revenue Statistics */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Statistik Pendapatan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatisticsCard
                                icon={DollarSign}
                                label="Pendapatan Hari Ini"
                                count={formatPrice(stats.revenue.today)}
                                color="green"
                            />
                            <StatisticsCard
                                icon={DollarSign}
                                label="Pendapatan Minggu Ini"
                                count={formatPrice(stats.revenue.week)}
                                color="emerald"
                            />
                            <StatisticsCard
                                icon={DollarSign}
                                label="Pendapatan Bulan Ini"
                                count={formatPrice(stats.revenue.month)}
                                color="teal"
                            />
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Orders Trend Chart */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <span>Trend Pesanan 30 Hari Terakhir</span>
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData.last30Days}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e5e7eb"
                                    />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fontSize: 12 }}
                                        stroke="#6b7280"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        stroke="#6b7280"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                "rgba(255, 255, 255, 0.95)",
                                            border: "none",
                                            borderRadius: "12px",
                                            boxShadow:
                                                "0 4px 6px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#3b82f6"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Depot Status Pie Chart */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Store className="w-5 h-5 text-purple-600" />
                                <span>Status Depot</span>
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={depotStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {depotStatusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Orders by Kelurahan Chart */}
                    <div className="glass-card rounded-2xl p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                            <ShoppingBag className="w-5 h-5 text-indigo-600" />
                            <span>Top 10 Pesanan per Kelurahan</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={chartData.byKelurahan}
                                layout="vertical"
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis type="number" stroke="#6b7280" />
                                <YAxis
                                    dataKey="Nama_Kel"
                                    type="category"
                                    width={150}
                                    tick={{ fontSize: 12 }}
                                    stroke="#6b7280"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.95)",
                                        border: "none",
                                        borderRadius: "12px",
                                        boxShadow:
                                            "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="#6366f1"
                                    radius={[0, 8, 8, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Pending Depots */}
                    {recentPendingDepots.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Depot Menunggu Approval
                                </h2>
                                <Link
                                    href="/admin/depots?status=pending"
                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    Lihat Semua →
                                </Link>
                            </div>
                            <div className="glass-card rounded-2xl overflow-hidden">
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
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/50 divide-y divide-gray-200">
                                        {recentPendingDepots.map((depot) => (
                                            <tr
                                                key={depot.ID_Mitra}
                                                className="hover:bg-white/80 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {depot.Nama_Mitra}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {depot.Pemilik}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {depot.kelurahan?.Nama_Kel},{" "}
                                                    {
                                                        depot.kelurahan
                                                            ?.kecamatan
                                                            ?.Nama_Kecamatan
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {new Date(
                                                        depot.created_at,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <Link
                                                        href={`/admin/depots/${depot.ID_Mitra}`}
                                                        className="text-purple-600 hover:text-purple-700 font-medium"
                                                    >
                                                        Review →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
