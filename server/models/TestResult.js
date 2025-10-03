const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wpm: {
    type: Number,
    required: true,
    min: 0
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctChars: {
    type: Number,
    required: true,
    min: 0
  },
  errors: {
    type: Number,
    required: true,
    min: 0
  },
  timeElapsed: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    enum: [30, 60, 120]
  },
  peakWPM: {
    type: Number,
    default: 0
  },
  testDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
testResultSchema.index({ user: 1, testDate: -1 });
testResultSchema.index({ wpm: -1 }); // For leaderboard

module.exports = mongoose.model('TestResult', testResultSchema);
