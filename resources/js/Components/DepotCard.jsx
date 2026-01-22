import {
    Droplets,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    Store,
} from "lucide-react";

export default function DepotCard({ depot, onClick }) {
    // Use depot status from backend (includes manual override)
    const depotOpen = depot.isOpen;

    return (
        <div
            onClick={() => depotOpen && onClick(depot)}
            className={`group relative overflow-hidden rounded-2xl glass-card transition-all duration-300 ${
                depotOpen
                    ? "hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
            }`}
        >
            {/* Depot Photo or Gradient Background */}
            {depot.Foto_Depot ? (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={`/storage/${depot.Foto_Depot}`}
                        alt={depot.Nama_Mitra}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Status badge on photo */}
                    <div className="absolute top-4 right-4">
                        <div
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                                depotOpen
                                    ? "bg-green-500/90 text-white"
                                    : "bg-red-500/90 text-white"
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
                </div>
            ) : (
                <div className="relative h-48 bg-gradient-to-br from-water-500 to-primary-500 flex items-center justify-center">
                    <Store className="w-20 h-20 text-white/30" />

                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                        <div
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                                depotOpen
                                    ? "bg-green-500/90 text-white"
                                    : "bg-red-500/90 text-white"
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
                </div>
            )}

            {/* Content */}
            <div className="p-6">
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
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Clock className="w-5 h-5 text-water-500" />
                    <span className="text-sm">
                        {depot.Jam_buka} - {depot.Jam_Tutup}
                    </span>
                </div>

                {/* Products sold */}
                <div className="text-xs text-gray-500">
                    {depot.products_sold || 0} produk terjual
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
