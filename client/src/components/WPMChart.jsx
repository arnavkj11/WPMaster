/**
 * Simple SVG-based WPM progression chart
 * Shows WPM over time without external chart libraries
 */
const WPMChart = ({ wpmHistory, height = 200, width = 600 }) => {
  if (!wpmHistory || wpmHistory.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
        <p className="text-gray-400">Not enough data to display chart</p>
      </div>
    );
  }

  const maxWPM = Math.max(...wpmHistory.map(d => d.wpm), 10);
  const maxTime = Math.max(...wpmHistory.map(d => d.time), 1);

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const scaleX = (time) => (time / maxTime) * chartWidth + padding.left;
  const scaleY = (wpm) => chartHeight - (wpm / maxWPM) * chartHeight + padding.top;

  // Generate path for line chart
  const linePath = wpmHistory
    .map((point, i) => {
      const x = scaleX(point.time);
      const y = scaleY(point.wpm);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Generate area fill path
  const areaPath = `${linePath} L ${scaleX(maxTime)} ${chartHeight + padding.top} L ${padding.left} ${chartHeight + padding.top} Z`;

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) =>
    Math.round((maxWPM / (yTicks - 1)) * i)
  );

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">WPM Progression</h3>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {yTickValues.map((value, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={scaleY(value)}
              x2={width - padding.right}
              y2={scaleY(value)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={scaleY(value) + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {value}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#gradient)"
          opacity="0.2"
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {wpmHistory.map((point, i) => (
          <circle
            key={i}
            cx={scaleX(point.time)}
            cy={scaleY(point.wpm)}
            r="4"
            fill="#4f46e5"
            className="hover:r-6 transition-all"
          />
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#9ca3af"
          strokeWidth="2"
        />

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#9ca3af"
          strokeWidth="2"
        />

        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          fontSize="14"
          fill="#374151"
          fontWeight="500"
        >
          Time (seconds)
        </text>
        <text
          x={15}
          y={height / 2}
          textAnchor="middle"
          fontSize="14"
          fill="#374151"
          fontWeight="500"
          transform={`rotate(-90, 15, ${height / 2})`}
        >
          WPM
        </text>
      </svg>
    </div>
  );
};

export default WPMChart;
