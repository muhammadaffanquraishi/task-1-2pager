const express = require("express");
const authMiddleware = require('./../middleware/authMiddleware')
const User = require("../models/user");
const Keyword = require("../models/Keyword");
const Category = require("../models/Category");

const router = express.Router();

// Search professionals by keyword, category, or service name
router.get("/search",  async (req, res) => {
  const { searchTerm } = req.query;

  try {
    let professionals = [];

    // 1. Check if the search term matches a keyword
    const foundKeyword = await Keyword.findOne({ keyword: searchTerm });
    if (foundKeyword) {
      professionals = await User.find({
        role: "professional",
        keywords: foundKeyword._id,
        // _id: { $ne: req.user.id },
      }).populate("categories keywords services");
    }

    // 2. If no professionals found by keyword, check if it's a category
    if (professionals.length === 0) {
      const foundCategory = await Category.findOne({ name: searchTerm });
      if (foundCategory) {
        professionals = await User.find({
          role: "professional",
          categories: foundCategory._id,
          // _id: { $ne: req.user.id },
        }).populate("categories keywords services");
      }
    }

    // 3. If no professionals found by category, check if it's a service name
    if (professionals.length === 0) {
      const foundService = await Service.findOne({ name: searchTerm });
      if (foundService) {
        professionals = await User.find({
          role: "professional",
          services: foundService._id,
          // _id: { $ne: req.user.id },
        }).populate("categories keywords services");
      }
    }

    res.json(professionals);
  } catch (error) {
    console.error("Error fetching professionals:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
