import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function NotificationBell({ count = 0, orders = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
            >
                <Bell className="w-6 h-6 text-white" />
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {count > 9 ? "9+" : count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-[100]">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">
                            Pesanan Masuk
                        </h3>
                        <p className="text-sm text-gray-600">
                            {count} pesanan baru
                        </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div
                                    key={order.ID_Pesanan}
                                    className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.visit("/dashboard/mitra");
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {order.pelanggan?.Nama}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {order.produk?.Nama_Produk} (
                                                {order.Jumlah}x)
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {formatTime(order.Tanggal_Pesan)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Tidak ada pesanan baru
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
