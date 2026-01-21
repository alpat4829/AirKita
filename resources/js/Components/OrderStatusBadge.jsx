export default function OrderStatusBadge({ status }) {
    const getStatusConfig = (status) => {
        switch (status) {
            case "Menunggu Pembayaran":
                return {
                    bg: "bg-yellow-100",
                    text: "text-yellow-700",
                    icon: "🟡",
                    label: "Menunggu Pembayaran",
                };
            case "Diproses Depot":
                return {
                    bg: "bg-blue-100",
                    text: "text-blue-700",
                    icon: "🔵",
                    label: "Diproses Depot",
                };
            case "Selesai":
                return {
                    bg: "bg-green-100",
                    text: "text-green-700",
                    icon: "🟢",
                    label: "Selesai",
                };
            case "Dibatalkan":
                return {
                    bg: "bg-red-100",
                    text: "text-red-700",
                    icon: "🔴",
                    label: "Dibatalkan",
                };
            default:
                return {
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                    icon: "⚪",
                    label: status,
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span
            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
        >
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
}
