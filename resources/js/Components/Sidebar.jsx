import { Home, ShoppingBag, User, LogOut, Droplets } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Sidebar({ currentRoute = "dashboard" }) {
    const menuItems = [
        {
            name: "Dashboard",
            icon: Home,
            route: "/dashboard/pelanggan",
            key: "dashboard",
        },
        {
            name: "Pesanan Saya",
            icon: ShoppingBag,
            route: "/dashboard/pelanggan/orders",
            key: "orders",
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
                        <p className="text-xs text-gray-600">
                            Dashboard Pelanggan
                        </p>
                    </div>
                </Link>
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
