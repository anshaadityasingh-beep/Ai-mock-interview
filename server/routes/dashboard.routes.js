const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { getSessionHistory, getCategoryStats } = require('../controllers/dashboardController');

// GET /api/dashboard/history
router.get('/history', verifyFirebaseToken, getSessionHistory);

// GET /api/dashboard/stats
router.get('/stats', verifyFirebaseToken, getCategoryStats);

module.exports = router;
