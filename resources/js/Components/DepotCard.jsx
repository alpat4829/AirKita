import { Droplets, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";

export default function DepotCard({ depot, onClick }) {
    // Check if depot is currently open
    const isOpen = () => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const [openHour, openMin] = depot.Jam_buka.split(":").map(Number);
        const [closeHour, closeMin] = depot.Jam_Tutup.split(":").map(Number);

        const openTime = openHour * 60 + openMin;
        const closeTime = closeHour * 60 + closeMin;

        return currentTime >= openTime && currentTime <= closeTime;
    };

    const depotOpen = isOpen();

    return (
        <div
            onClick={() => depotOpen && onClick(depot)}
            className={`group relative overflow-hidden rounded-2xl glass-card p-6 transition-all duration-300 ${
                depotOpen
                    ? "hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
            }`}
        >
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-water-200 to-primary-200 rounded-full -mr-16 -mt-16 opacity-30 group-hover:opacity-50 transition-opacity"></div>

            {/* Content */}
            <div className="relative">
                {/* Header with icon */}
                <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-water-500 to-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Droplets className="w-7 h-7 text-white" />
                    </div>

                    {/* Status badge */}
                    <div
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                            depotOpen
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {depotOpen ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Buka</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4" />
                                <span>Tutup</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Depot name */}
                <h3 className="text-2xl font-brush text-gray-900 mb-2 group-hover:text-water-600 transition-colors">
                    {depot.Nama_Mitra}
                </h3>

                {/* Location */}
                <div className="flex items-start space-x-2 text-gray-600 mb-3">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-water-500" />
                    <div className="flex-1">
                        <p className="text-sm leading-relaxed">
                            {depot.Alamat}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {depot.kelurahan?.Nama_Kel}
                        </p>
                    </div>
                </div>

                {/* Operating hours */}
                <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-5 h-5 text-water-500" />
                    <span className="text-sm">
                        {depot.Jam_buka} - {depot.Jam_Tutup}
                    </span>
                </div>

                {/* Hover indicator */}
                {depotOpen && (
                    <div className="mt-4 pt-4 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm text-water-600 font-medium">
                            Klik untuk melihat produk →
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
