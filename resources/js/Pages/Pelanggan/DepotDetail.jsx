import { Head, router } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import ProductCard from "@/Components/ProductCard";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function DepotDetail({ auth, depot, pelanggan }) {
    const handleOrder = async (product, quantity) => {
        try {
            const response = await axios.post("/dashboard/pelanggan/order", {
                id_produk: product.ID_Produk,
                jumlah: quantity,
            });

            // Open Midtrans payment popup
            window.snap.pay(response.data.snap_token, {
                onSuccess: function (result) {
                    toast.success("Pembayaran berhasil!");
                    router.visit("/dashboard/pelanggan/orders");
                },
                onPending: function (result) {
                    toast.info("Menunggu pembayaran...");
                    router.visit("/dashboard/pelanggan/orders");
                },
                onError: function (result) {
                    toast.error("Pembayaran gagal!");
                },
                onClose: function () {
                    toast("Popup pembayaran ditutup");
                },
            });
        } catch (error) {
            toast.error("Gagal membuat pesanan");
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Head title={`${depot.Nama_Mitra} - Produk`} />

            {/* Sidebar */}
            <Sidebar currentRoute="dashboard" />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Depot Photo Banner */}
                    {depot.Foto_Depot && (
                        <div className="relative h-80 rounded-2xl overflow-hidden mb-8">
                            <img
                                src={`/storage/${depot.Foto_Depot}`}
                                alt={depot.Nama_Mitra}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                            {/* Depot name overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <h1 className="text-4xl font-brush text-white mb-2">
                                    {depot.Nama_Mitra}
                                </h1>
                                <div className="flex items-center space-x-4 text-white/90">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-5 h-5" />
                                        <span>{depot.kelurahan?.Nama_Kel}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-5 h-5" />
                                        <span>
                                            {depot.Jam_buka} - {depot.Jam_Tutup}
                                        </span>
                                    </div>
                                    {depot.isOpen && (
                                        <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-green-500/90 text-white text-sm font-medium">
                                            <span>● Buka Sekarang</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Depot info card */}
                    <div className="glass-card rounded-2xl p-6 mb-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Informasi Depot
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-water-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-gray-700">
                                                {depot.Alamat}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {depot.kelurahan?.Nama_Kel}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-water-500" />
                                        <span className="text-gray-700">
                                            {depot.Jam_buka} - {depot.Jam_Tutup}
                                        </span>
                                    </div>
                                    {depot.Pemilik && (
                                        <div className="flex items-center space-x-3">
                                            <span className="w-5 h-5 flex items-center justify-center">
                                                👤
                                            </span>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Pemilik
                                                </p>
                                                <p className="text-gray-700 font-medium">
                                                    {depot.Pemilik}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Kontak
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-5 h-5 text-water-500" />
                                        <span className="text-gray-700">
                                            {depot.No_HP}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-5 h-5 text-water-500" />
                                        <span className="text-gray-700">
                                            {depot.Email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Depot Description */}
                    {depot.Deskripsi_Depot && (
                        <div className="glass-card rounded-2xl p-6 mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Tentang Depot
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {depot.Deskripsi_Depot}
                            </p>
                        </div>
                    )}

                    {/* Products section */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-brush text-gray-900 mb-4">
                            Produk Tersedia
                        </h3>
                    </div>

                    {depot.produk && depot.produk.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {depot.produk.map((product) => (
                                <ProductCard
                                    key={product.ID_Produk}
                                    product={product}
                                    onOrder={handleOrder}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum Ada Produk
                            </h3>
                            <p className="text-gray-600">
                                Depot ini belum menambahkan produk untuk dijual
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
