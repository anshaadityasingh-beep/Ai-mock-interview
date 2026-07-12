const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const {
  addProblemLog,
  getProblemLogs,
  getPatternStats,
} = require('../controllers/problemLogController');

// POST /api/problems - Protected
router.post('/', verifyFirebaseToken, addProblemLog);

// GET /api/problems - Protected
router.get('/', verifyFirebaseToken, getProblemLogs);

// GET /api/problems/stats - Protected
router.get('/stats', verifyFirebaseToken, getPatternStats);

module.exports = router;
