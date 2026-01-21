import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DepotCard from "@/Components/DepotCard";
import DepotFilters from "@/Components/DepotFilters";
import { useState } from "react";
import { Droplets, ShoppingBag } from "lucide-react";

export default function DashboardPelanggan({
    auth,
    depots,
    kelurahanList,
    kecamatanList,
    pelanggan,
}) {
    const [selectedKelurahan, setSelectedKelurahan] = useState(
        pelanggan.ID_KELURAHAN,
    );
    const [selectedKecamatan, setSelectedKecamatan] = useState("");
    const [filteredDepots, setFilteredDepots] = useState(depots);

    const handleKelurahanChange = (value) => {
        setSelectedKelurahan(value);
        filterDepots(value, selectedKecamatan);
    };

    const handleKecamatanChange = (value) => {
        setSelectedKecamatan(value);
        filterDepots(selectedKelurahan, value);
    };

    const filterDepots = (kelurahanId, kecamatanId) => {
        let filtered = depots;

        if (kelurahanId) {
            filtered = filtered.filter((d) => d.ID_KELURAHAN == kelurahanId);
        }

        if (kecamatanId) {
            filtered = filtered.filter(
                (d) => d.kelurahan?.ID_Kecamatan == kecamatanId,
            );
        }

        setFilteredDepots(filtered);
    };

    const handleReset = () => {
        setSelectedKelurahan(pelanggan.ID_KELURAHAN);
        setSelectedKecamatan("");
        setFilteredDepots(depots);
    };

    const handleDepotClick = (depot) => {
        router.visit(`/dashboard/pelanggan/depot/${depot.ID_Mitra}`);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-3xl font-brush text-gray-900">
                            Depot Air Terdekat
                        </h2>
                    </div>
                    <button
                        onClick={() =>
                            router.visit("/dashboard/pelanggan/orders")
                        }
                        className="glass-button px-6 py-2 rounded-xl text-white font-medium flex items-center space-x-2 hover:scale-105 transition-transform"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span>Pesanan Saya</span>
                    </button>
                </div>
            }
        >
            <Head title="Dashboard Pelanggan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome message */}
                    <div className="glass-card rounded-2xl p-6 mb-6">
                        <h3 className="text-2xl font-brush text-gray-900 mb-2">
                            Selamat Datang, {pelanggan.Nama} ! !
                        </h3>
                        <p className="text-gray-700">
                            Temukan depot air minum terdekat dan pesan dengan
                            mudah !
                        </p>
                    </div>

                    {/* Filters */}
                    <DepotFilters
                        kelurahanList={kelurahanList}
                        kecamatanList={kecamatanList}
                        selectedKelurahan={selectedKelurahan}
                        selectedKecamatan={selectedKecamatan}
                        onKelurahanChange={handleKelurahanChange}
                        onKecamatanChange={handleKecamatanChange}
                        onReset={handleReset}
                    />

                    {/* Depot grid */}
                    {filteredDepots.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDepots.map((depot) => (
                                <DepotCard
                                    key={depot.ID_Mitra}
                                    depot={depot}
                                    onClick={handleDepotClick}
                                />
                            ))}
                        </div>
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
        </AuthenticatedLayout>
    );
}
