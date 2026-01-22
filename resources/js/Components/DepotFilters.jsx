import GlassSelect from "./GlassSelect";
import { Filter } from "lucide-react";

export default function DepotFilters({
    kelurahanList,
    kecamatanList,
    selectedKelurahan,
    selectedKecamatan,
    selectedBestSelling,
    onKelurahanChange,
    onKecamatanChange,
    onBestSellingChange,
    onReset,
}) {
    const bestSellingOptions = [
        { value: "", label: "Semua Depot" },
        { value: "true", label: "Terlaris" },
    ];

    return (
        <div className="glass-card rounded-2xl p-6 mb-6 relative z-50">
            <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-water-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                    Filter Depot
                </h3>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                {/* Kelurahan filter */}
                <div className="relative z-40">
                    <GlassSelect
                        label="Kelurahan"
                        value={selectedKelurahan}
                        onChange={onKelurahanChange}
                        options={kelurahanList.map((k) => ({
                            value: k.ID_KELURAHAN,
                            label: k.Nama_Kel,
                        }))}
                        placeholder="Semua Kelurahan"
                    />
                </div>

                {/* Kecamatan filter */}
                <div className="relative z-30">
                    <GlassSelect
                        label="Kecamatan"
                        value={selectedKecamatan}
                        onChange={onKecamatanChange}
                        options={kecamatanList.map((k) => ({
                            value: k.ID_Kecamatan,
                            label: k.Nama_Kec,
                        }))}
                        placeholder="Semua Kecamatan"
                    />
                </div>

                {/* Best selling filter */}
                <div className="relative z-20">
                    <GlassSelect
                        label="Kategori"
                        value={selectedBestSelling}
                        onChange={onBestSellingChange}
                        options={bestSellingOptions}
                        placeholder="Semua Kategori"
                    />
                </div>

                {/* Reset button */}
                <div className="flex items-end">
                    <button
                        onClick={onReset}
                        className="glass-button w-full py-3 rounded-xl text-white font-medium hover:scale-105 transition-transform"
                    >
                        Reset Filter
                    </button>
                </div>
            </div>
        </div>
    );
}
