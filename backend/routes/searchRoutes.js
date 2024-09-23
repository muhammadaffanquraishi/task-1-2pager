const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Search professionals by keyword
router.get('/search', async (req, res) => {
  const { keyword } = req.query; // Get the search keyword from the query string

  try {
    // Find professionals whose keywords match the search term
    const professionals = await User.find({
      role: 'professional',
      keywords: { $in: [keyword] }, // Match professionals who have the keyword in their keywords array
    }).populate('categories keywords');

    res.json(professionals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Search professionals by category and keyword
router.get('/professionals/by-category', async (req, res) => {
    const { categoryId } = req.query;
  
    try {
      // Find all professionals who belong to a specific category
      const professionals = await User.find({
        role: 'professional',
        categories: categoryId,  // Filter by category
      }).populate('categories keywords');
  
      res.json(professionals);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

module.exports = router;