import {
    LayoutDashboard,
    Store,
    ShoppingBag,
    FileText,
    LogOut,
    Droplets,
    Shield,
} from "lucide-react";
import { Link } from "@inertiajs/react";

export default function AdminSidebar({
    currentRoute = "dashboard",
    pendingCount = 0,
}) {
    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            route: "/admin/dashboard",
            key: "dashboard",
        },
        {
            name: "Depot Approval",
            icon: Store,
            route: "/admin/depots",
            key: "depots",
            badge: pendingCount > 0 ? pendingCount : null,
        },
        {
            name: "Orders",
            icon: ShoppingBag,
            route: "/admin/orders",
            key: "orders",
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
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-brush text-gray-900">
                            AirKita
                        </h1>
                        <p className="text-xs text-gray-600">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Admin Info */}
            <div className="px-6 py-4 border-b border-white/20">
                <div className="text-xs text-gray-600 mb-1">Role</div>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-900">
                        Super Admin
                    </span>
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
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? "glass-button text-white shadow-lg"
                                    : "text-gray-700 hover:bg-white/50 hover:shadow-md"
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            {item.badge && (
                                <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                                    {item.badge}
                                </span>
                            )}
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
