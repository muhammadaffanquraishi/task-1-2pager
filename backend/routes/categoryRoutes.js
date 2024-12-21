const express = require('express');
const authMiddleware = require('./../middleware/authMiddleware')
const Category = require('../models/Category'); // Make sure the model is correct
const User = require('./../models/user');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();  // Fetch all categories from the database
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put("/profile/append-categories", authMiddleware, async (req, res) => {
  const { categories } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { categories } });
    res.json({ message: "Categories updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;