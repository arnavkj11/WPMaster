import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            ⌨️ Typing Speed Test
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Measure your typing speed, track your progress, and compete with others!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/test')}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Start Typing Test
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  Login / Sign Up
                </button>
                <button
                  onClick={() => navigate('/test')}
                  className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Continue as Guest
                </button>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Real-time Tracking</h3>
            <p className="text-gray-600">
              Get instant feedback on your typing speed (WPM), accuracy, and errors as you type. Watch your progress in real-time!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Advanced Analytics</h3>
            <p className="text-gray-600">
              View detailed WPM progression charts, error analysis, and identify your most common mistakes to improve faster.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Leaderboard</h3>
            <p className="text-gray-600">
              Compete with typists worldwide! See how you rank on the global leaderboard and track your personal bests.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-10 shadow-xl mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Choose Duration</h4>
              <p className="text-gray-600 text-sm">Select 30s, 60s, or 120s test</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Start Typing</h4>
              <p className="text-gray-600 text-sm">Type the displayed text as fast as you can</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Get Results</h4>
              <p className="text-gray-600 text-sm">View your WPM, accuracy, and insights</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Track Progress</h4>
              <p className="text-gray-600 text-sm">Save results and improve over time</p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 shadow-xl text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Typing Test?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Accurate WPM Calculation</h4>
                <p className="text-indigo-100">Industry-standard formula (5 chars = 1 word)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Character-Level Feedback</h4>
                <p className="text-indigo-100">See correct (green) and incorrect (red) characters instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Personal Dashboard</h4>
                <p className="text-indigo-100">Track total tests, average WPM, best scores, and history</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Error Analysis</h4>
                <p className="text-indigo-100">Identify your most common typing mistakes</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">WPM Progression Chart</h4>
                <p className="text-indigo-100">Visualize your typing speed throughout the test</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Free & No Ads</h4>
                <p className="text-indigo-100">100% free to use with no interruptions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Test Your Speed?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            {isAuthenticated
              ? "Jump right in and start improving your typing skills!"
              : "Create an account to save your progress and compete on the leaderboard!"}
          </p>
          <button
            onClick={() => navigate(isAuthenticated ? '/test' : '/auth')}
            className="px-10 py-5 bg-indigo-600 text-white rounded-lg font-semibold text-xl hover:bg-indigo-700 transition-colors shadow-lg"
          >
            {isAuthenticated ? "Start Typing Now" : "Get Started Free"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Typing Speed Test. Built with React, Express, and MongoDB.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
