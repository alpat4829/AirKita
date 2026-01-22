import { Head } from "@inertiajs/react";
import MitraSidebar from "@/Components/MitraSidebar";
import { Package, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function MitraProducts({ auth, products, mitra, isOpen }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        nama_produk: "",
        harga: "",
        deskripsi: "",
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                await axios.put(
                    `/dashboard/mitra/products/${editingProduct.ID_Produk}`,
                    formData,
                );
                toast.success("Produk berhasil diupdate");
            } else {
                await axios.post("/dashboard/mitra/products", formData);
                toast.success("Produk berhasil ditambahkan");
            }

            setShowAddModal(false);
            setEditingProduct(null);
            setFormData({ nama_produk: "", harga: "", deskripsi: "" });
            window.location.reload();
        } catch (error) {
            toast.error("Gagal menyimpan produk");
            console.error(error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            nama_produk: product.Nama_Produk,
            harga: product.Harga,
            deskripsi: product.Deskripsi || "",
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;

        try {
            await axios.delete(`/dashboard/mitra/products/${id}`);
            toast.success("Produk berhasil dihapus");
            window.location.reload();
        } catch (error) {
            toast.error("Gagal menghapus produk");
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Head title="Manajemen Produk" />

            {/* Sidebar */}
            <MitraSidebar
                currentRoute="products"
                isOpen={isOpen}
                depotName={mitra.Nama_Mitra}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-brush text-gray-900 mb-2">
                                Manajemen Produk
                            </h1>
                            <p className="text-gray-600">
                                Kelola produk yang Anda jual
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingProduct(null);
                                setFormData({
                                    nama_produk: "",
                                    harga: "",
                                    deskripsi: "",
                                });
                                setShowAddModal(true);
                            }}
                            className="glass-button px-6 py-3 rounded-xl text-white font-medium flex items-center space-x-2 hover:scale-105 transition-transform"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Tambah Produk</span>
                        </button>
                    </div>

                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.ID_Produk}
                                    className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-water-500 to-primary-500 rounded-xl flex items-center justify-center">
                                            <Package className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(product)
                                                }
                                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        product.ID_Produk,
                                                    )
                                                }
                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {product.Nama_Produk}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {product.Deskripsi ||
                                            "Tidak ada deskripsi"}
                                    </p>

                                    <p className="text-2xl font-brush text-water-600">
                                        {formatPrice(product.Harga)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum Ada Produk
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Tambahkan produk pertama Anda untuk mulai
                                berjualan
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="glass-button px-6 py-3 rounded-xl text-white font-medium inline-flex items-center space-x-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Tambah Produk</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-brush text-gray-900 mb-6">
                            {editingProduct
                                ? "Edit Produk"
                                : "Tambah Produk Baru"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Nama Produk
                                </label>
                                <input
                                    type="text"
                                    value={formData.nama_produk}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nama_produk: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-water-500 focus:ring-2 focus:ring-water-200 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Harga
                                </label>
                                <input
                                    type="number"
                                    value={formData.harga}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            harga: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-water-500 focus:ring-2 focus:ring-water-200 transition-all"
                                    required
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={formData.deskripsi}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            deskripsi: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-water-500 focus:ring-2 focus:ring-water-200 transition-all"
                                    rows="3"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingProduct(null);
                                        setFormData({
                                            nama_produk: "",
                                            harga: "",
                                            deskripsi: "",
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
                                    {editingProduct ? "Update" : "Tambah"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
