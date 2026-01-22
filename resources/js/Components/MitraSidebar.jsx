import {
    Home,
    ShoppingBag,
    Package,
    User,
    LogOut,
    Droplets,
    Power,
} from "lucide-react";
import { Link } from "@inertiajs/react";

export default function MitraSidebar({
    currentRoute = "dashboard",
    isOpen = false,
    depotName = "",
}) {
    const menuItems = [
        {
            name: "Statistik",
            icon: Home,
            route: "/dashboard/mitra",
            key: "dashboard",
        },
        {
            name: "History",
            icon: ShoppingBag,
            route: "/dashboard/mitra/orders",
            key: "orders",
        },
        {
            name: "Produk",
            icon: Package,
            route: "/dashboard/mitra/products",
            key: "products",
        },
        {
            name: "Profile",
            icon: User,
            route: "/profile",
            key: "profile",
        },
    ];

    return (
        <div className="w-64 h-screen glass-card flex flex-col sticky top-0">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-white/20">
                <Link
                    href="/"
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-water-500 to-primary-500 rounded-xl flex items-center justify-center">
                        <Droplets className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-brush text-gray-900">
                            AirKita
                        </h1>
                        <p className="text-xs text-gray-600">Dashboard Mitra</p>
                    </div>
                </Link>
            </div>

            {/* Depot Status */}
            <div className="px-6 py-4 border-b border-white/20">
                <div className="text-xs text-gray-600 mb-1">Depot Anda</div>
                <div className="font-medium text-gray-900 mb-2 truncate">
                    {depotName}
                </div>
                <div
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium ${
                        isOpen
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    <Power className="w-4 h-4" />
                    <span>{isOpen ? "Buka" : "Tutup"}</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentRoute === item.key;

                    return (
                        <Link
                            key={item.key}
                            href={item.route}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? "glass-button text-white shadow-lg"
                                    : "text-gray-700 hover:bg-white/50 hover:shadow-md"
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-white/20">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </Link>
            </div>
        </div>
    );
}
