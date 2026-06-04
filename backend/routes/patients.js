const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Update patient health summary
router.put('/health', protect, async (req, res) => {
  try {
    const { bloodGroup, knownMedicalConditions, currentMedications, age, phone } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { bloodGroup, knownMedicalConditions, currentMedications, age, phone },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
