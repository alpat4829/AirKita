export default function StatCard({
    title,
    value,
    icon: Icon,
    color = "water",
    trend,
}) {
    const colorClasses = {
        water: {
            bg: "from-water-500 to-water-600",
            icon: "bg-water-100 text-water-600",
        },
        primary: {
            bg: "from-primary-500 to-primary-600",
            icon: "bg-primary-100 text-primary-600",
        },
        green: {
            bg: "from-green-500 to-green-600",
            icon: "bg-green-100 text-green-600",
        },
        orange: {
            bg: "from-orange-500 to-orange-600",
            icon: "bg-orange-100 text-orange-600",
        },
    };

    const colors = colorClasses[color] || colorClasses.water;

    return (
        <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium mb-2">
                        {title}
                    </p>
                    <p className="text-3xl font-brush text-gray-900 mb-1">
                        {value}
                    </p>
                    {trend && <p className="text-sm text-gray-500">{trend}</p>}
                </div>
                <div
                    className={`w-14 h-14 rounded-xl ${colors.icon} flex items-center justify-center`}
                >
                    <Icon className="w-7 h-7" />
                </div>
            </div>
        </div>
    );
}
