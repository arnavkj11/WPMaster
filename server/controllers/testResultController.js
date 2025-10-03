const TestResult = require('../models/TestResult');

// @desc    Save test result
// @route   POST /api/results
// @access  Private
const saveTestResult = async (req, res) => {
  try {
    const { wpm, accuracy, correctChars, errors, timeElapsed, duration, peakWPM } = req.body;

    // Validation
    if (!wpm || !accuracy || correctChars === undefined || errors === undefined || !timeElapsed || !duration) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const testResult = await TestResult.create({
      user: req.user._id,
      wpm,
      accuracy,
      correctChars,
      errors,
      timeElapsed,
      duration,
      peakWPM: peakWPM || 0
    });

    res.status(201).json(testResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's test results
// @route   GET /api/results/user
// @access  Private
const getUserResults = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const results = await TestResult.find({ user: req.user._id })
      .sort({ testDate: -1 })
      .limit(limit)
      .skip(skip);

    const total = await TestResult.countDocuments({ user: req.user._id });

    res.json({
      results,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/results/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user._id });

    if (results.length === 0) {
      return res.json({
        totalTests: 0,
        averageWPM: 0,
        averageAccuracy: 0,
        bestWPM: 0,
        recentProgress: []
      });
    }

    const totalTests = results.length;
    const averageWPM = Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / totalTests);
    const averageAccuracy = Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests);
    const bestWPM = Math.max(...results.map(r => r.wpm));

    // Get recent progress (last 10 tests)
    const recentProgress = results
      .sort((a, b) => new Date(b.testDate) - new Date(a.testDate))
      .slice(0, 10)
      .reverse()
      .map(r => ({
        date: r.testDate,
        wpm: r.wpm,
        accuracy: r.accuracy
      }));

    res.json({
      totalTests,
      averageWPM,
      averageAccuracy,
      bestWPM,
      recentProgress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/results/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const duration = parseInt(req.query.duration) || 60;
    const limit = parseInt(req.query.limit) || 10;

    // Get top WPM scores for specific duration
    const results = await TestResult.find({ duration })
      .sort({ wpm: -1 })
      .limit(limit)
      .populate('user', 'username');

    // Group by user and get their best score
    const userBestScores = {};
    results.forEach(result => {
      const userId = result.user._id.toString();
      if (!userBestScores[userId] || result.wpm > userBestScores[userId].wpm) {
        userBestScores[userId] = {
          username: result.user.username,
          wpm: result.wpm,
          accuracy: result.accuracy,
          testDate: result.testDate
        };
      }
    });

    const leaderboard = Object.values(userBestScores)
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, limit);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveTestResult,
  getUserResults,
  getUserStats,
  getLeaderboard
};
