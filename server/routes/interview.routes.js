const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { startSession, sendMessage } = require('../controllers/interviewController');
const { scoreSession } = require('../controllers/scoringController');

// POST /api/interview/start — start a new interview session
router.post('/start', verifyFirebaseToken, startSession);

// POST /api/interview/message — send a message in an active session
router.post('/message', verifyFirebaseToken, sendMessage);

// POST /api/interview/score — score a completed session (Module 5)
router.post('/score', verifyFirebaseToken, scoreSession);

module.exports = router;
