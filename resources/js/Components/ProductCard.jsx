import { Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

export default function ProductCard({ product, onOrder }) {
    const [quantity, setQuantity] = useState(1);
    const [isOrdering, setIsOrdering] = useState(false);

    const handleOrder = () => {
        setIsOrdering(true);
        onOrder(product, quantity);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:shadow-xl transition-all duration-300">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-water-200 to-primary-200 rounded-full -mr-12 -mt-12 opacity-30 group-hover:opacity-50 transition-opacity"></div>

            {/* Content */}
            <div className="relative">
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-water-500 to-primary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Package className="w-6 h-6 text-white" />
                </div>

                {/* Product name */}
                <h3 className="text-xl font-brush text-gray-900 mb-2">
                    {product.Nama_Produk}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.Deskripsi}
                </p>

                {/* Price */}
                <div className="mb-4">
                    <span className="text-2xl font-brush text-water-600">
                        {formatPrice(product.Harga)}
                    </span>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center space-x-3 mb-4">
                    <label className="text-sm font-medium text-gray-700">
                        Jumlah:
                    </label>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() =>
                                setQuantity(Math.max(1, quantity - 1))
                            }
                            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                            -
                        </button>
                        <span className="w-12 text-center font-semibold">
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Order button */}
                <button
                    onClick={handleOrder}
                    disabled={isOrdering}
                    className="glass-button w-full py-3 rounded-xl text-white font-medium flex items-center justify-center space-x-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                        {isOrdering ? "Memproses..." : "Pesan Sekarang"}
                    </span>
                </button>
            </div>
        </div>
    );
}
