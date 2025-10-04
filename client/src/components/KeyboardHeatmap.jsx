import { useMemo } from 'react';

const KeyboardHeatmap = ({ keyPressData = {} }) => {
  // Standard QWERTY keyboard layout
  const keyboardLayout = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    [' '] // Space bar
  ];

  // Calculate color intensity based on press count
  const getKeyColor = (key) => {
    const data = keyPressData[key.toLowerCase()] || { correct: 0, errors: 0 };
    const total = data.correct + data.errors;

    if (total === 0) {
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }

    const errorRate = data.errors / total;

    // Green gradient for low error rate, red gradient for high error rate
    if (errorRate < 0.1) {
      const intensity = Math.min(total * 20, 500); // Max at 500
      return `bg-green-${Math.min(Math.floor(intensity / 100) * 100 + 100, 500)} text-white`;
    } else if (errorRate < 0.3) {
      return 'bg-yellow-400 text-gray-900';
    } else {
      const intensity = Math.min(data.errors * 30, 500);
      return `bg-red-${Math.min(Math.floor(intensity / 100) * 100 + 100, 500)} text-white`;
    }
  };

  // Get custom styles for dynamic colors
  const getKeyStyle = (key) => {
    const data = keyPressData[key.toLowerCase()] || { correct: 0, errors: 0 };
    const total = data.correct + data.errors;

    if (total === 0) return {};

    const errorRate = data.errors / total;

    if (errorRate < 0.1) {
      const intensity = Math.min((total / 10) * 0.7, 0.9);
      return {
        backgroundColor: `rgba(34, 197, 94, ${intensity})`,
        color: 'white'
      };
    } else if (errorRate < 0.3) {
      return {
        backgroundColor: 'rgb(251, 191, 36)',
        color: '#1f2937'
      };
    } else {
      const intensity = Math.min((data.errors / 5) * 0.7, 0.9);
      return {
        backgroundColor: `rgba(239, 68, 68, ${intensity})`,
        color: 'white'
      };
    }
  };

  const getKeyStats = (key) => {
    const data = keyPressData[key.toLowerCase()] || { correct: 0, errors: 0 };
    const total = data.correct + data.errors;
    return `${total} (${data.errors} errors)`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Keyboard Heatmap</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Shows which keys you typed most (green = high accuracy, yellow = medium, red = many errors)
      </p>

      <div className="space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-1 justify-center"
            style={{ paddingLeft: rowIndex === 1 ? '20px' : rowIndex === 2 ? '30px' : rowIndex === 3 ? '40px' : '0' }}
          >
            {row.map((key) => {
              const isSpace = key === ' ';
              return (
                <div
                  key={key}
                  className={`
                    ${isSpace ? 'flex-1 max-w-md' : 'w-12'}
                    h-12 flex items-center justify-center
                    rounded font-mono font-semibold text-sm
                    border border-gray-300 dark:border-gray-600
                    transition-all hover:scale-105 hover:shadow-md
                  `}
                  style={getKeyStyle(key)}
                  title={getKeyStats(key)}
                >
                  {isSpace ? 'SPACE' : key}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-4 justify-center text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.7)' }}></div>
          <span className="text-gray-700 dark:text-gray-300">High accuracy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-yellow-400"></div>
          <span className="text-gray-700 dark:text-gray-300">Medium accuracy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.7)' }}></div>
          <span className="text-gray-700 dark:text-gray-300">Low accuracy</span>
        </div>
      </div>
    </div>
  );
};

export default KeyboardHeatmap;
