import { useState } from 'react';
import { formatTime } from '../utils/calculations';
import WPMChart from './WPMChart';
import KeyboardHeatmap from './KeyboardHeatmap';
import { aiAPI } from '../services/api';

const Results = ({
  wpm,
  accuracy,
  correctChars,
  errors,
  timeElapsed,
  onRestart,
  wpmHistory = [],
  commonMistakes = [],
  peakWPM = 0,
  keyPressData = {},
  difficulty = 'intermediate',
  category = 'general'
}) => {
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const getWPMRating = (wpm) => {
    if (wpm < 20) return { text: 'Beginner', color: 'text-red-600', bg: 'bg-red-50' };
    if (wpm < 40) return { text: 'Average', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (wpm < 60) return { text: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (wpm < 80) return { text: 'Very Good', color: 'text-green-600', bg: 'bg-green-50' };
    return { text: 'Excellent', color: 'text-purple-600', bg: 'bg-purple-50' };
  };

  const rating = getWPMRating(wpm);

  const handleGenerateFeedback = async () => {
    setIsLoadingFeedback(true);
    try {
      const response = await aiAPI.analyzeErrors({
        wpm,
        accuracy,
        errors,
        commonMistakes,
        peakWPM,
        timeElapsed,
        difficulty,
        category
      });

      if (response.success && response.feedback) {
        setAiFeedback(response.feedback);
      }
    } catch (error) {
      console.error('Failed to generate AI feedback:', error);
      setAiFeedback('Failed to generate personalized feedback. Please try again.');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <svg
              className="w-20 h-20 mx-auto text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Test Complete!</h2>
          <p className="text-gray-600">Here are your results</p>
        </div>

        {/* Main WPM Display */}
        <div className="text-center mb-8">
          <div className={`inline-block px-8 py-4 rounded-xl ${rating.bg} mb-4`}>
            <p className="text-sm text-gray-600 mb-1">Your Speed</p>
            <p className="text-6xl font-bold text-indigo-600">{wpm}</p>
            <p className="text-xl text-gray-700">Words Per Minute</p>
          </div>
          <div className={`inline-block px-6 py-2 rounded-full ${rating.bg} mt-2`}>
            <p className={`font-semibold ${rating.color}`}>{rating.text}</p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Accuracy</p>
            <p className="text-4xl font-bold text-green-600">{accuracy}%</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Time</p>
            <p className="text-4xl font-bold text-blue-600">{formatTime(timeElapsed)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center border border-purple-200">
            <p className="text-sm text-gray-600 mb-2">Peak WPM</p>
            <p className="text-4xl font-bold text-purple-600">{peakWPM}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center border border-red-200">
            <p className="text-sm text-gray-600 mb-2">Errors</p>
            <p className="text-4xl font-bold text-red-600">{errors}</p>
          </div>
        </div>

        {/* WPM Progression Chart */}
        {wpmHistory.length > 1 && (
          <div className="mb-8">
            <WPMChart wpmHistory={wpmHistory} width={700} height={250} />
          </div>
        )}

        {/* Error Analysis */}
        {commonMistakes.length > 0 && (
          <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Common Mistakes</h3>
            <div className="space-y-3">
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-mono bg-red-100 text-red-700 px-3 py-1 rounded">
                      {mistake.expected === ' ' ? '␣' : mistake.expected}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-2xl font-mono bg-orange-100 text-orange-700 px-3 py-1 rounded">
                      {mistake.typed === ' ' ? '␣' : mistake.typed}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Count:</span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {mistake.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Heatmap */}
        {Object.keys(keyPressData).length > 0 && (
          <div className="mb-8">
            <KeyboardHeatmap keyPressData={keyPressData} />
          </div>
        )}

        {/* AI Personalized Feedback */}
        <div className="mb-8">
          {!aiFeedback ? (
            <div className="text-center">
              <button
                onClick={handleGenerateFeedback}
                disabled={isLoadingFeedback}
                className={`px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-3 mx-auto ${
                  isLoadingFeedback
                    ? 'bg-gray-400 text-white cursor-wait'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                }`}
              >
                {isLoadingFeedback ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating AI Feedback...
                  </>
                ) : (
                  <>
                    🤖 Get Personalized AI Feedback
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🤖</span>
                <h3 className="text-xl font-bold text-gray-800">AI Coach Feedback</h3>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {aiFeedback}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onRestart}
            className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
