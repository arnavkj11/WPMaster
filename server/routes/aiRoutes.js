const express = require('express');
const router = express.Router();
const { generateText, analyzeErrors } = require('../controllers/aiController');

// POST /api/ai/generate-text - Generate AI text for typing practice
router.post('/generate-text', generateText);

// POST /api/ai/analyze-errors - Generate personalized error analysis
router.post('/analyze-errors', analyzeErrors);

module.exports = router;
