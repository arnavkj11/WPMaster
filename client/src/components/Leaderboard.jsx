import { useState, useEffect } from 'react';
import { resultsAPI } from '../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(60);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedDuration]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await resultsAPI.getLeaderboard(selectedDuration, 10);
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (index === 2) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>

        {/* Duration Filter */}
        <div className="flex gap-2">
          {[30, 60, 120].map((duration) => (
            <button
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedDuration === duration
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {duration}s
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No results yet. Be the first to set a record!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg ${getRankColor(index)} transition-all hover:scale-105`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                {index < 3 ? (
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                ) : (
                  <span className="text-xl font-bold text-gray-600">#{index + 1}</span>
                )}
              </div>

              {/* Username */}
              <div className="flex-grow">
                <p className="font-semibold text-lg">{entry.username}</p>
                <p className={`text-sm ${index < 3 ? 'text-white/80' : 'text-gray-500'}`}>
                  {new Date(entry.testDate).toLocaleDateString()}
                </p>
              </div>

              {/* Stats */}
              <div className="text-right">
                <p className="text-2xl font-bold">{entry.wpm} WPM</p>
                <p className={`text-sm ${index < 3 ? 'text-white/80' : 'text-gray-500'}`}>
                  {entry.accuracy}% accuracy
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
