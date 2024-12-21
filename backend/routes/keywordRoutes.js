const express = require('express');
const authMiddleware = require('./../middleware/authMiddleware')
const Keyword = require('../models/Keyword');  // Make sure the model is correct
const User = require('./../models/user')
const router = express.Router();

// Get all keywords
router.get('/', async (req, res) => {
  try {
    const keywords = await Keyword.find();  // Fetch all keywords from the database
    res.json(keywords);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put("/profile/append-keywords", authMiddleware, async (req, res) => {
  const { keywords } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { keywords } });
    res.json({ message: "Keywords updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;