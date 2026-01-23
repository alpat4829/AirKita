export default function StatisticsCard({
    icon: Icon,
    label,
    count,
    color = "blue",
}) {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        yellow: "from-yellow-500 to-yellow-600",
        red: "from-red-500 to-red-600",
        purple: "from-purple-500 to-purple-600",
    };

    const iconBgClasses = {
        blue: "bg-blue-100",
        green: "bg-green-100",
        yellow: "bg-yellow-100",
        red: "bg-red-100",
        purple: "bg-purple-100",
    };

    return (
        <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        {label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                </div>
                <div
                    className={`w-16 h-16 ${iconBgClasses[color]} rounded-2xl flex items-center justify-center`}
                >
                    <Icon className={`w-8 h-8 text-${color}-600`} />
                </div>
            </div>
        </div>
    );
}
