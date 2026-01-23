export default function AreaLineChart({
    data,
    dataKey,
    formatValue,
    color = "green",
}) {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map((item) => item[dataKey]));
    const minValue = Math.min(...data.map((item) => item[dataKey]));

    // Chart dimensions
    const chartWidth = 600;
    const chartHeight = 180;
    const padding = { top: 30, right: 30, bottom: 10, left: 30 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    // Calculate points for the line
    const points = data.map((item, index) => {
        const x = padding.left + (index / (data.length - 1)) * innerWidth;
        const valueRange = maxValue - minValue || 1;
        const normalizedValue = (item[dataKey] - minValue) / valueRange;
        const y = padding.top + (1 - normalizedValue) * innerHeight;

        return { x, y, value: item[dataKey] };
    });

    // Create smooth curve path using cubic bezier curves
    const createSmoothPath = (points) => {
        if (points.length === 0) return "";
        if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

        let path = `M ${points[0].x},${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];

            // Control points for smooth curve
            const controlPointX = (current.x + next.x) / 2;

            path += ` C ${controlPointX},${current.y} ${controlPointX},${next.y} ${next.x},${next.y}`;
        }

        return path;
    };

    // Create area path (line + bottom)
    const createAreaPath = (points) => {
        const linePath = createSmoothPath(points);
        const lastPoint = points[points.length - 1];
        const firstPoint = points[0];

        // Close the path at the bottom
        return `${linePath} L ${lastPoint.x},${chartHeight - padding.bottom} L ${firstPoint.x},${chartHeight - padding.bottom} Z`;
    };

    const linePath = createSmoothPath(points);
    const areaPath = createAreaPath(points);

    // Color schemes
    const colorSchemes = {
        green: {
            gradient: ["#10b981", "#059669"],
            line: "#059669",
            dot: "#10b981",
        },
        blue: {
            gradient: ["#3b82f6", "#2563eb"],
            line: "#2563eb",
            dot: "#3b82f6",
        },
        purple: {
            gradient: ["#a855f7", "#9333ea"],
            line: "#9333ea",
            dot: "#a855f7",
        },
    };

    const scheme = colorSchemes[color] || colorSchemes.green;

    return (
        <div className="w-full">
            {/* SVG Chart */}
            <div
                className="relative w-full"
                style={{ height: `${chartHeight}px` }}
            >
                <svg
                    width="100%"
                    height={chartHeight}
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Gradient definition */}
                    <defs>
                        <linearGradient
                            id={`gradient-${dataKey}-${color}`}
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                stopColor={scheme.gradient[0]}
                                stopOpacity="0.4"
                            />
                            <stop
                                offset="100%"
                                stopColor={scheme.gradient[1]}
                                stopOpacity="0.05"
                            />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                        d={areaPath}
                        fill={`url(#gradient-${dataKey}-${color})`}
                        className="transition-all duration-500"
                    />

                    {/* Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke={scheme.line}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-500"
                    />

                    {/* Dots and labels on data points */}
                    {points.map((point, index) => (
                        <g key={index}>
                            {/* Value label above dot */}
                            <text
                                x={point.x}
                                y={point.y - 12}
                                textAnchor="middle"
                                className="text-xs font-bold fill-gray-700"
                                style={{ fontSize: "11px" }}
                            >
                                {formatValue
                                    ? formatValue(point.value)
                                    : point.value}
                            </text>

                            {/* Dot */}
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="5"
                                fill="white"
                                stroke={scheme.dot}
                                strokeWidth="3"
                                className="transition-all duration-300 hover:r-7 cursor-pointer"
                            />
                        </g>
                    ))}
                </svg>
            </div>

            {/* Date labels */}
            <div className="flex items-center justify-between mt-3 px-2">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex-1 text-center text-xs text-gray-600 font-medium"
                    >
                        {item.date}
                    </div>
                ))}
            </div>
        </div>
    );
}
