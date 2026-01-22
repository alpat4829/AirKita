import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Power, Clock, Edit, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function DepotManagement({ mitra, isOpen, className = "" }) {
    const [showHoursModal, setShowHoursModal] = useState(false);
    const [showDescModal, setShowDescModal] = useState(false);
    const [hoursData, setHoursData] = useState({
        jam_buka: mitra.Jam_buka.substring(0, 5),
        jam_tutup: mitra.Jam_Tutup.substring(0, 5),
    });

    const { data, setData, post, processing } = useForm({
        deskripsi_depot: mitra.Deskripsi_Depot || "",
    });

    const toggleDepotStatus = async () => {
        try {
            await axios.post("/dashboard/mitra/toggle-status");
            toast.success("Status depot diupdate");
            window.location.reload();
        } catch (error) {
            toast.error("Gagal mengubah status");
            console.error(error);
        }
    };

    const resetToAutomatic = async () => {
        try {
            await axios.post("/dashboard/mitra/reset-status");
            toast.success("Status kembali otomatis");
            window.location.reload();
        } catch (error) {
            toast.error("Gagal reset status");
            console.error(error);
        }
    };

    const handleUpdateHours = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/dashboard/mitra/update-hours", hoursData);
            toast.success("Jam operasional diupdate");
            setShowHoursModal(false);
            window.location.reload();
        } catch (error) {
            toast.error("Gagal update jam operasional");
            console.error(error);
        }
    };

    const handleUpdateDescription = (e) => {
        e.preventDefault();
        post(route("profile.updateDepotDescription"), {
            onSuccess: () => {
                toast.success("Deskripsi depot berhasil diupdate");
                setShowDescModal(false);
            },
            onError: () => {
                toast.error("Gagal update deskripsi");
            },
        });
    };

    return (
        <div className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Manajemen Depot
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Kelola status, jam operasional, dan deskripsi depot Anda
                </p>
            </header>

            <div className="mt-6 space-y-6">
                {/* Depot Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <h3 className="font-medium text-gray-900">
                            Status Depot
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {isOpen
                                ? "Depot saat ini buka"
                                : "Depot saat ini tutup"}
                        </p>
                        {mitra.Manual_Status !== null && (
                            <p className="text-xs text-gray-500 mt-1">
                                Manual override aktif
                            </p>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={toggleDepotStatus}
                            className={`px-4 py-2 rounded-xl transition-colors flex items-center space-x-2 ${
                                isOpen
                                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                            }`}
                        >
                            <Power className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {isOpen ? "Tutup Depot" : "Buka Depot"}
                            </span>
                        </button>
                        {mitra.Manual_Status !== null && (
                            <button
                                onClick={resetToAutomatic}
                                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center space-x-2"
                            >
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    Auto
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <h3 className="font-medium text-gray-900">
                            Jam Operasional
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {mitra.Jam_buka} - {mitra.Jam_Tutup}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowHoursModal(true)}
                        className="px-4 py-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors flex items-center space-x-2"
                    >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm font-medium">Ubah Jam</span>
                    </button>
                </div>

                {/* Depot Description */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                            Deskripsi Depot
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {mitra.Deskripsi_Depot || "Belum ada deskripsi"}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDescModal(true)}
                        className="px-4 py-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors flex items-center space-x-2"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {mitra.Deskripsi_Depot ? "Edit" : "Tambah"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Edit Hours Modal */}
            {showHoursModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-brush text-gray-900 mb-6">
                            Ubah Jam Operasional
                        </h3>

                        <form
                            onSubmit={handleUpdateHours}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Jam Buka
                                </label>
                                <input
                                    type="time"
                                    value={hoursData.jam_buka}
                                    onChange={(e) =>
                                        setHoursData({
                                            ...hoursData,
                                            jam_buka: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-water-500 focus:ring-2 focus:ring-water-200 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Jam Tutup
                                </label>
                                <input
                                    type="time"
                                    value={hoursData.jam_tutup}
                                    onChange={(e) =>
                                        setHoursData({
                                            ...hoursData,
                                            jam_tutup: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-water-500 focus:ring-2 focus:ring-water-200 transition-all"
                                    required
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowHoursModal(false);
                                        setHoursData({
                                            jam_buka: mitra.Jam_buka.substring(
                                                0,
                                                5,
                                            ),
                                            jam_tutup:
                                                mitra.Jam_Tutup.substring(0, 5),
                                        });
                                    }}
                                    className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 glass-button px-6 py-3 rounded-xl text-white font-medium hover:scale-105 transition-transform"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Description Modal */}
            {showDescModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-brush text-gray-900 mb-6">
                            Deskripsi Depot
                        </h3>

                        <form
                            onSubmit={handleUpdateDescription}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.deskripsi_depot}
                                    onChange={(e) =>
                                        setData(
                                            "deskripsi_depot",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-water-500 focus:ring-2 focus:ring-water-200 transition-all"
                                    rows="5"
                                    placeholder="Ceritakan tentang depot Anda..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Deskripsi akan ditampilkan di halaman detail
                                    depot
                                </p>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDescModal(false);
                                        setData(
                                            "deskripsi_depot",
                                            mitra.Deskripsi_Depot || "",
                                        );
                                    }}
                                    className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 glass-button px-6 py-3 rounded-xl text-white font-medium hover:scale-105 transition-transform disabled:opacity-50"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
