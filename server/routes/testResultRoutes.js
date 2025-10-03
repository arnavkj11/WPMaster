const express = require('express');
const router = express.Router();
const {
  saveTestResult,
  getUserResults,
  getUserStats,
  getLeaderboard
} = require('../controllers/testResultController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, saveTestResult);
router.get('/user', protect, getUserResults);
router.get('/stats', protect, getUserStats);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
