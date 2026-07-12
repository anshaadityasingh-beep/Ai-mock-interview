const ProblemLog = require('../models/ProblemLog');
const User = require('../models/User');

/**
 * POST /api/problems
 * Adds a new manual DSA problem log.
 */
const addProblemLog = async (req, res) => {
  const { title, pattern, difficulty, notes } = req.body;
  const { uid } = req.user;

  if (!title || !pattern || !difficulty) {
    return res.status(400).json({ error: 'Title, pattern, and difficulty are required.' });
  }

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const newLog = await ProblemLog.create({
      userId: user._id,
      title,
      pattern,
      difficulty,
      notes,
    });

    return res.status(201).json(newLog);
  } catch (error) {
    console.error('Error adding problem log:', error.message);
    return res.status(500).json({ error: 'Failed to add problem log.' });
  }
};

/**
 * GET /api/problems
 * Fetches all problem logs for the user, sorted by solvedAt descending.
 */
const getProblemLogs = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const logs = await ProblemLog.find({ userId: user._id })
      .sort({ solvedAt: -1 });

    return res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching problem logs:', error.message);
    return res.status(500).json({ error: 'Failed to fetch problem logs.' });
  }
};

/**
 * GET /api/problems/stats
 * Aggregates count of problems solved per pattern.
 * E.g., { "two pointers": 12, "sliding window": 8 }
 */
const getPatternStats = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const stats = await ProblemLog.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: '$pattern', count: { $sum: 1 } } }
    ]);

    // Format stats array into a simple object: { patternName: count }
    const formattedStats = {};
    stats.forEach((item) => {
      formattedStats[item._id] = item.count;
    });

    return res.status(200).json(formattedStats);
  } catch (error) {
    console.error('Error fetching pattern stats:', error.message);
    return res.status(500).json({ error: 'Failed to fetch pattern stats.' });
  }
};

module.exports = {
  addProblemLog,
  getProblemLogs,
  getPatternStats,
};
