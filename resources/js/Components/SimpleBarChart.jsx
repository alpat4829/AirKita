export default function SimpleBarChart({ data, dataKey, label, formatValue }) {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map((item) => item[dataKey]));

    return (
        <div className="w-full">
            <div className="flex items-end justify-between space-x-2 h-48">
                {data.map((item, index) => {
                    const height =
                        maxValue > 0 ? (item[dataKey] / maxValue) * 100 : 0;

                    return (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center"
                        >
                            <div className="w-full flex flex-col items-center justify-end h-full">
                                <div className="text-xs font-medium text-gray-700 mb-1">
                                    {formatValue
                                        ? formatValue(item[dataKey])
                                        : item[dataKey]}
                                </div>
                                <div
                                    className="w-full bg-gradient-to-t from-water-500 to-primary-500 rounded-t-lg transition-all duration-500 hover:opacity-80"
                                    style={{
                                        height: `${height}%`,
                                        minHeight:
                                            item[dataKey] > 0 ? "8px" : "0",
                                    }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-2 font-medium">
                                {item.date}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
