const QuestionBank = require('../models/QuestionBank');
const Session = require('../models/Session');
const User = require('../models/User');
const { sendToGemini } = require('../config/gemini');
const { buildInterviewerPrompt } = require('../prompts/interviewerPrompt');

// Maximum AI turns before marking session complete
const MAX_AI_TURNS = 4;

/**
 * POST /api/interview/start
 * Picks a random question for the given category, starts a Gemini chat,
 * and creates a new Session document.
 */
const startSession = async (req, res) => {
  const { category } = req.body;
  const { uid } = req.user;

  if (!category) {
    return res.status(400).json({ error: 'Category is required.' });
  }

  try {
    // Find the MongoDB user by Firebase UID
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please log in again.' });
    }

    // Pick a random question for the category
    const count = await QuestionBank.countDocuments({ topic: category });
    if (count === 0) {
      return res.status(404).json({ error: `No questions found for category: ${category}` });
    }
    const randomIndex = Math.floor(Math.random() * count);
    const question = await QuestionBank.findOne({ topic: category }).skip(randomIndex);

    // Build the system prompt
    const systemPrompt = buildInterviewerPrompt({
      category: question.topic,
      question: question.question,
      expectedDepth: question.expectedDepth,
      difficulty: question.difficulty,
    });

    // Get the AI's opening message (pass empty history, empty first user trigger)
    const openingMessage = await sendToGemini(systemPrompt, [], 'Begin the interview.');

    // Create session in DB
    const session = await Session.create({
      userId: user._id,
      category,
      questionId: question._id,
      transcript: [{ role: 'ai', message: openingMessage }],
      status: 'in_progress',
    });

    return res.status(201).json({
      sessionId: session._id,
      aiMessage: openingMessage,
    });
  } catch (error) {
    console.error('Error starting session:', error.message);
    return res.status(500).json({ error: 'Failed to start interview session. Please try again.' });
  }
};

/**
 * POST /api/interview/message
 * Accepts a user message, appends it to the session transcript, calls Gemini
 * with full history, and returns the AI's next response.
 */
const sendMessage = async (req, res) => {
  const { sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: 'sessionId and message are required.' });
  }

  try {
    const session = await Session.findById(sessionId).populate('questionId');
    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }
    if (session.status === 'completed') {
      return res.status(400).json({ error: 'This session is already completed.' });
    }

    // Append the user message to transcript
    session.transcript.push({ role: 'user', message });

    // Rebuild the system prompt from stored question
    const q = session.questionId;
    const systemPrompt = buildInterviewerPrompt({
      category: q.topic,
      question: q.question,
      expectedDepth: q.expectedDepth,
      difficulty: q.difficulty,
    });

    // Convert transcript to Gemini history format
    // Gemini expects: [{role: 'user'|'model', parts: [{text}]}]
    // Skip the very last user message (we'll send it separately)
    const history = session.transcript.slice(0, -1).map((turn) => ({
      role: turn.role === 'ai' ? 'model' : 'user',
      parts: [{ text: turn.message }],
    }));

    // Get AI response
    const aiResponse = await sendToGemini(systemPrompt, history, message);

    // Append AI response to transcript
    session.transcript.push({ role: 'ai', message: aiResponse });

    // Count AI turns (excluding the opening message)
    const aiTurnCount = session.transcript.filter((t) => t.role === 'ai').length;

    // Mark completed if we've hit the turn limit
    if (aiTurnCount >= MAX_AI_TURNS) {
      session.status = 'completed';
    }

    await session.save();

    return res.status(200).json({
      aiMessage: aiResponse,
      status: session.status,
    });
  } catch (error) {
    console.error('Error sending message:', error.message);
    return res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
};

module.exports = { startSession, sendMessage };
