const mongoose = require('mongoose');

const QuestionBankSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  subtopic: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  expectedDepth: {
    type: [String],
    default: [],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
});

module.exports = mongoose.model('QuestionBank', QuestionBankSchema);
