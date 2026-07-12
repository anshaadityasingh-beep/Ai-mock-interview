const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const User = require('../models/User');

// POST /api/auth/sync
// Protected: verifies Firebase token, then upserts a User doc in MongoDB
router.post('/sync', verifyFirebaseToken, async (req, res) => {
  const { uid, email } = req.user;

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email,
        name: email.split('@')[0], // default name until profile is set
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error syncing user:', error.message);
    return res.status(500).json({ error: 'Server error while syncing user.' });
  }
});

module.exports = router;
