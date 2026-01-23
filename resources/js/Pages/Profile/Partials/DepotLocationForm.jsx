import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { MapPin, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import GoogleMapInput from "@/Components/GoogleMapInput";

export default function DepotLocationForm({ mitra, apiKey, className = "" }) {
    const { data, setData, post, processing } = useForm({
        latitude: mitra.Latitude || null,
        longitude: mitra.Longitude || null,
    });

    const [showMap, setShowMap] = useState(false);

    const handleLocationChange = ({ latitude, longitude }) => {
        setData({
            latitude,
            longitude,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("profile.updateDepotLocation"), {
            onSuccess: () => {
                toast.success("Lokasi depot berhasil diupdate");
            },
            onError: () => {
                toast.error("Gagal update lokasi depot");
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Lokasi Depot
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Atur lokasi depot Anda agar mudah ditemukan pelanggan
                </p>
            </header>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Current Location Info */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-water-500" />
                            <span>
                                {data.latitude && data.longitude
                                    ? "Lokasi Sudah Diatur"
                                    : "Lokasi Belum Diatur"}
                            </span>
                        </h3>
                        {data.latitude && data.longitude && (
                            <p className="text-sm text-gray-600 mt-1 font-mono">
                                {parseFloat(data.latitude).toFixed(6)},{" "}
                                {parseFloat(data.longitude).toFixed(6)}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowMap(!showMap)}
                        className="px-4 py-2 rounded-xl bg-water-100 text-water-600 hover:bg-water-200 transition-colors flex items-center space-x-2"
                    >
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {showMap ? "Sembunyikan Peta" : "Atur Lokasi"}
                        </span>
                    </button>
                </div>

                {/* Map Input */}
                {showMap && (
                    <div className="space-y-4">
                        <GoogleMapInput
                            latitude={data.latitude}
                            longitude={data.longitude}
                            onLocationChange={handleLocationChange}
                            apiKey={apiKey}
                        />

                        {/* Save Button */}
                        {data.latitude && data.longitude && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full glass-button px-6 py-3 rounded-xl text-white font-medium hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                <Save className="w-5 h-5" />
                                <span>
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Lokasi"}
                                </span>
                            </button>
                        )}
                    </div>
                )}
            </form>
        </section>
    );
}
