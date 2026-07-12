const mongoose = require('mongoose');

const ProblemLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  pattern: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  notes: {
    type: String,
  },
  solvedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ProblemLog', ProblemLogSchema);
