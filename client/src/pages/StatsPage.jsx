import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resultsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Leaderboard from '../components/Leaderboard';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchStats();
  }, [isAuthenticated]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [statsData, resultsData] = await Promise.all([
        resultsAPI.getUserStats(),
        resultsAPI.getUserResults(1, 5)
      ]);
      setStats(statsData);
      setRecentResults(resultsData.results);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Your Stats</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Take a Test
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Total Tests</p>
            <p className="text-4xl font-bold text-indigo-600">{stats?.totalTests || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Average WPM</p>
            <p className="text-4xl font-bold text-green-600">{stats?.averageWPM || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Best WPM</p>
            <p className="text-4xl font-bold text-purple-600">{stats?.bestWPM || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Accuracy</p>
            <p className="text-4xl font-bold text-orange-600">{stats?.averageAccuracy || 0}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Progress */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Progress</h2>
            {stats?.recentProgress && stats.recentProgress.length > 0 ? (
              <div className="space-y-3">
                {stats.recentProgress.map((test, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-lg">{test.wpm} WPM</p>
                      <p className="text-sm text-gray-500">
                        {new Date(test.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Accuracy</p>
                      <p className="font-semibold text-green-600">{test.accuracy}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No tests yet. Start typing to see your progress!</p>
            )}
          </div>

          {/* Leaderboard */}
          <Leaderboard />
        </div>

        {/* Recent Results Table */}
        {recentResults.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Tests</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">WPM</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResults.map((result, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(result.testDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">{result.wpm}</td>
                      <td className="py-3 px-4">{result.accuracy}%</td>
                      <td className="py-3 px-4">{result.duration}s</td>
                      <td className="py-3 px-4 text-red-600">{result.errors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
