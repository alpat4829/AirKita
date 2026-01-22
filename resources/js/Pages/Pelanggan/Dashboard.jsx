import { Head, router } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import StatisticsCard from "@/Components/StatisticsCard";
import DepotCard from "@/Components/DepotCard";
import DepotFilters from "@/Components/DepotFilters";
import Pagination from "@/Components/Pagination";
import { useState } from "react";
import {
    Droplets,
    ShoppingBag,
    Package,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";

export default function DashboardPelanggan({
    auth,
    depots,
    kelurahanList,
    kecamatanList,
    pelanggan,
    statistics,
}) {
    const [selectedKelurahan, setSelectedKelurahan] = useState(
        pelanggan.ID_KELURAHAN,
    );
    const [selectedKecamatan, setSelectedKecamatan] = useState("");
    const [selectedBestSelling, setSelectedBestSelling] = useState("");

    const handleKelurahanChange = (value) => {
        setSelectedKelurahan(value);
        applyFilters(value, selectedKecamatan, selectedBestSelling);
    };

    const handleKecamatanChange = (value) => {
        setSelectedKecamatan(value);
        applyFilters(selectedKelurahan, value, selectedBestSelling);
    };

    const handleBestSellingChange = (value) => {
        setSelectedBestSelling(value);
        applyFilters(selectedKelurahan, selectedKecamatan, value);
    };

    const applyFilters = (kelurahanId, kecamatanId, bestSelling) => {
        router.get(
            "/dashboard/pelanggan",
            {
                kelurahan: kelurahanId || undefined,
                kecamatan: kecamatanId || undefined,
                best_selling: bestSelling || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleReset = () => {
        setSelectedKelurahan(pelanggan.ID_KELURAHAN);
        setSelectedKecamatan("");
        setSelectedBestSelling("");
        router.get("/dashboard/pelanggan");
    };

    const handleDepotClick = (depot) => {
        router.visit(`/dashboard/pelanggan/depot/${depot.ID_Mitra}`);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Head title="Dashboard Pelanggan" />

            {/* Sidebar */}
            <Sidebar currentRoute="dashboard" />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-brush text-gray-900 mb-2">
                            Selamat Datang, {pelanggan.Nama}!
                        </h1>
                        <p className="text-gray-600">
                            Temukan depot air minum terdekat dan pesan dengan
                            mudah
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatisticsCard
                            icon={Package}
                            label="Total Pesanan"
                            count={statistics.total}
                            color="blue"
                        />
                        <StatisticsCard
                            icon={CheckCircle}
                            label="Pesanan Selesai"
                            count={statistics.completed}
                            color="green"
                        />
                        <StatisticsCard
                            icon={Clock}
                            label="Pesanan Pending"
                            count={statistics.pending}
                            color="yellow"
                        />
                        <StatisticsCard
                            icon={XCircle}
                            label="Pesanan Dibatalkan"
                            count={statistics.cancelled}
                            color="red"
                        />
                    </div>

                    {/* Filters */}
                    <DepotFilters
                        kelurahanList={kelurahanList}
                        kecamatanList={kecamatanList}
                        selectedKelurahan={selectedKelurahan}
                        selectedKecamatan={selectedKecamatan}
                        selectedBestSelling={selectedBestSelling}
                        onKelurahanChange={handleKelurahanChange}
                        onKecamatanChange={handleKecamatanChange}
                        onBestSellingChange={handleBestSellingChange}
                        onReset={handleReset}
                    />

                    {/* Depot Grid */}
                    {depots.data && depots.data.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {depots.data.map((depot) => (
                                    <DepotCard
                                        key={depot.ID_Mitra}
                                        depot={depot}
                                        onClick={handleDepotClick}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                links={depots.links}
                                from={depots.from}
                                to={depots.to}
                                total={depots.total}
                            />
                        </>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <Droplets className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Tidak Ada Depot Ditemukan
                            </h3>
                            <p className="text-gray-600">
                                Coba ubah filter atau reset untuk melihat semua
                                depot
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
