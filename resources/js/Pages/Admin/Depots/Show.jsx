import { Head, router } from "@inertiajs/react";
import AdminSidebar from "@/Components/AdminSidebar";
import {
    Store,
    User,
    MapPin,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    Package,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function DepotsShow({ auth, depot }) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApprove = async () => {
        if (!confirm("Apakah Anda yakin ingin menyetujui depot ini?")) {
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(`/admin/depots/${depot.ID_Mitra}/approve`);
            toast.success("Depot berhasil disetujui!");
            router.visit("/admin/depots");
        } catch (error) {
            toast.error("Gagal menyetujui depot");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async (e) => {
        e.preventDefault();
        if (!rejectionReason.trim()) {
            toast.error("Alasan penolakan harus diisi");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(`/admin/depots/${depot.ID_Mitra}/reject`, {
                reason: rejectionReason,
            });
            toast.success("Depot berhasil ditolak");
            router.visit("/admin/depots");
        } catch (error) {
            toast.error("Gagal menolak depot");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: (
                <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-yellow-100 text-yellow-700 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Pending Approval</span>
                </span>
            ),
            approved: (
                <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-100 text-green-700 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Approved</span>
                </span>
            ),
            rejected: (
                <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-100 text-red-700 flex items-center space-x-2">
                    <XCircle className="w-4 h-4" />
                    <span>Rejected</span>
                </span>
            ),
        };
        return badges[status] || null;
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <Head title={`Review Depot - ${depot.Nama_Mitra}`} />

            {/* Sidebar */}
            <AdminSidebar currentRoute="depots" />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-4xl font-brush text-gray-900">
                                Review Depot
                            </h1>
                            {getStatusBadge(depot.approval_status)}
                        </div>
                        <p className="text-gray-600">
                            Tinjau informasi depot sebelum memberikan
                            persetujuan
                        </p>
                    </div>

                    {/* Depot Information */}
                    <div className="glass-card rounded-2xl p-8 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                            <Store className="w-6 h-6 text-purple-600" />
                            <span>Informasi Depot</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Nama Depot
                                </label>
                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                    {depot.Nama_Mitra}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>Pemilik</span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                    {depot.Pemilik}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                                    <Mail className="w-4 h-4" />
                                    <span>Email</span>
                                </label>
                                <p className="text-lg text-gray-900 mt-1">
                                    {depot.Email}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                                    <Phone className="w-4 h-4" />
                                    <span>No. HP</span>
                                </label>
                                <p className="text-lg text-gray-900 mt-1">
                                    {depot.No_HP}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>Alamat</span>
                                </label>
                                <p className="text-lg text-gray-900 mt-1">
                                    {depot.Alamat}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {depot.kelurahan?.Nama_Kel},{" "}
                                    {depot.kelurahan?.kecamatan?.Nama_Kecamatan}
                                    ,{" "}
                                    {
                                        depot.kelurahan?.kecamatan?.kabupaten
                                            ?.Nama_Kabupaten
                                    }
                                    ,{" "}
                                    {
                                        depot.kelurahan?.kecamatan?.kabupaten
                                            ?.provinsi?.Nama_Provinsi
                                    }
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Jam Operasional</span>
                                </label>
                                <p className="text-lg text-gray-900 mt-1">
                                    {depot.Jam_buka} - {depot.Jam_Tutup}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Tanggal Registrasi</span>
                                </label>
                                <p className="text-lg text-gray-900 mt-1">
                                    {new Date(
                                        depot.created_at,
                                    ).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            {depot.Deskripsi_Depot && (
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">
                                        Deskripsi Depot
                                    </label>
                                    <p className="text-gray-900 mt-1">
                                        {depot.Deskripsi_Depot}
                                    </p>
                                </div>
                            )}

                            {depot.Latitude && depot.Longitude && (
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">
                                        Koordinat
                                    </label>
                                    <p className="text-gray-900 mt-1">
                                        Lat: {depot.Latitude}, Long:{" "}
                                        {depot.Longitude}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Products */}
                    {depot.produk && depot.produk.length > 0 && (
                        <div className="glass-card rounded-2xl p-8 mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                                <Package className="w-6 h-6 text-purple-600" />
                                <span>Produk ({depot.produk.length})</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {depot.produk.map((product) => (
                                    <div
                                        key={product.ID_Produk}
                                        className="bg-white/50 rounded-xl p-4"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {product.Nama_Produk}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Stok: {product.Stok}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-purple-600">
                                                    Rp{" "}
                                                    {product.Harga.toLocaleString(
                                                        "id-ID",
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rejection Reason (if rejected) */}
                    {depot.approval_status === "rejected" &&
                        depot.rejection_reason && (
                            <div className="glass-card rounded-2xl p-8 mb-6 border-2 border-red-200">
                                <h2 className="text-2xl font-semibold text-red-900 mb-4 flex items-center space-x-2">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                    <span>Alasan Penolakan</span>
                                </h2>
                                <p className="text-gray-900">
                                    {depot.rejection_reason}
                                </p>
                                {depot.verified_at && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Ditolak pada:{" "}
                                        {new Date(
                                            depot.verified_at,
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                )}
                            </div>
                        )}

                    {/* Action Buttons */}
                    {depot.approval_status === "pending" && (
                        <div className="flex space-x-4">
                            <button
                                onClick={handleApprove}
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircle className="w-5 h-5" />
                                <span>Setujui Depot</span>
                            </button>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <XCircle className="w-5 h-5" />
                                <span>Tolak Depot</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass-card rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            Tolak Depot
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Berikan alasan penolakan untuk depot ini:
                        </p>
                        <form onSubmit={handleReject}>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                }
                                placeholder="Contoh: Lokasi tidak sesuai dengan kriteria..."
                                className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all resize-none"
                                rows="4"
                                required
                            />
                            <div className="flex space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason("");
                                    }}
                                    className="flex-1 px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? "Memproses..." : "Tolak"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
