const Session = require('../models/Session');
const { sendToGemini } = require('../config/gemini');
const { buildScoringPrompt } = require('../prompts/scoringPrompt');

/**
 * POST /api/interview/score
 * Reads the full session transcript, sends it to Gemini for evaluation,
 * parses the JSON response, and saves the score to the Session document.
 */
const scoreSession = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required.' });
  }

  try {
    const session = await Session.findById(sessionId).populate('questionId');
    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    const question = session.questionId;
    const prompt = buildScoringPrompt({
      category: session.category,
      question: question.question,
      transcript: session.transcript,
    });

    // Gemini stateless call — send the scoring prompt as the user turn with no history
    const rawResponse = await sendToGemini(prompt, [], 'Please evaluate the transcript and return the JSON score.');

    // Strip markdown code fences in case Gemini wraps the JSON anyway
    const cleaned = rawResponse
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    let scoreData;
    try {
      scoreData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse Gemini scoring response:', rawResponse);
      return res.status(500).json({
        error: 'Failed to parse the scoring response from AI. Please try again.',
      });
    }

    // Save score, mark completed, set completedAt
    session.score = scoreData;
    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    return res.status(200).json({ score: scoreData });
  } catch (error) {
    console.error('Error scoring session:', error.message);
    return res.status(500).json({ error: 'Failed to score the session. Please try again.' });
  }
};

module.exports = { scoreSession };
