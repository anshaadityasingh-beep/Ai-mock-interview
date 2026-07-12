const mongoose = require('mongoose');

const TranscriptSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['ai', 'user'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ScoreSchema = new mongoose.Schema({
  approachCorrectness: {
    type: String,
  },
  depthOfUnderstanding: {
    type: String,
  },
  communicationClarity: {
    type: String,
  },
  neededHints: {
    type: Boolean,
  },
  oneLineFeedback: {
    type: String,
  },
}, { _id: false });

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionBank',
  },
  transcript: {
    type: [TranscriptSchema],
    default: [],
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress',
  },
  score: {
    type: ScoreSchema,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Session', SessionSchema);
