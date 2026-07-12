const Session = require('../models/Session');
const User = require('../models/User');

/**
 * GET /api/dashboard/history
 * Fetches all completed sessions for the logged-in user, sorted by newest first.
 * Returns only essential fields (excludes the heavy transcript).
 */
const getSessionHistory = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const sessions = await Session.find({ userId: user._id, status: 'completed' })
      .sort({ completedAt: -1 })
      .populate('questionId', 'question') // Only grab the question text
      .select('category questionId score completedAt');

    // Format the response slightly to lift question text out
    const history = sessions.map((s) => ({
      _id: s._id,
      category: s.category,
      question: s.questionId?.question || 'Unknown Question',
      score: s.score,
      completedAt: s.completedAt,
    }));

    return res.status(200).json({ history });
  } catch (error) {
    console.error('Error fetching session history:', error.message);
    return res.status(500).json({ error: 'Failed to fetch session history.' });
  }
};

/**
 * GET /api/dashboard/stats
 * Aggregates a readiness score per category based on completed sessions.
 * Readiness = % of sessions with "correct" approach AND "strong" depth.
 */
const getCategoryStats = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const sessions = await Session.find({ userId: user._id, status: 'completed' })
      .select('category score');

    const stats = {};
    const categories = ['DSA', 'OS', 'DBMS', 'CN', 'OOP'];

    // Initialize all categories to 0 readiness initially
    // We'll also track total/perfect counts to calculate the percentage
    const tracking = {};
    categories.forEach((cat) => {
      tracking[cat] = { total: 0, perfect: 0 };
    });

    // Tally up
    sessions.forEach((s) => {
      if (!tracking[s.category]) {
        tracking[s.category] = { total: 0, perfect: 0 };
      }
      tracking[s.category].total += 1;

      if (
        s.score?.approachCorrectness === 'correct' &&
        s.score?.depthOfUnderstanding === 'strong'
      ) {
        tracking[s.category].perfect += 1;
      }
    });

    // Calculate percentages
    categories.forEach((cat) => {
      const data = tracking[cat];
      if (data.total === 0) {
        stats[cat] = 0;
      } else {
        stats[cat] = Math.round((data.perfect / data.total) * 100);
      }
    });

    // Handle any dynamic categories not in the default list
    Object.keys(tracking).forEach((cat) => {
      if (!stats.hasOwnProperty(cat)) {
        const data = tracking[cat];
        stats[cat] = data.total === 0 ? 0 : Math.round((data.perfect / data.total) * 100);
      }
    });

    return res.status(200).json({ stats });
  } catch (error) {
    console.error('Error fetching category stats:', error.message);
    return res.status(500).json({ error: 'Failed to fetch category stats.' });
  }
};

module.exports = { getSessionHistory, getCategoryStats };
