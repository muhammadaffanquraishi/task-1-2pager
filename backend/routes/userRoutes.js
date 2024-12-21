const express = require("express");
const User = require("../models/user");
const Booking = require('./../models/booking');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Update user profile
router.put("/profile/update", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user's ID
    const updates = req.body; // Fields to update

    // Validate if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow specific fields to be updated
    const allowedUpdates = ["name", "email","password", "personalDetails"];
    if (user.role === "professional") {
      allowedUpdates.push(
        "categories",
        "keywords",
        "services",
        "availableHours",
        "hoursPerDay",
        "hourlyPrice",
        "availableDates"
      );
    }

    // Ensure only allowed fields are updated
    const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = updates[key];
      }
      return acc;
    }, {});

    // Update the user profile
    Object.assign(user, filteredUpdates);
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update professional profile with keywords
router.put("/profile/professional", authMiddleware, async (req, res) => {
  const { keywords, categories } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user.role !== "professional") {
      return res
        .status(403)
        .json({ message: "Not authorized to update professional details" });
    }

    // Assign selected keywords and categories to the professional
    user.keywords = keywords;
    user.categories = categories;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Remove service
router.put("/profile/remove-services", authMiddleware, async (req, res) => {
  const { id } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, { $pull: { services: id } });
    res.json({ message: "Service removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Remove category
router.put("/profile/remove-categories", authMiddleware, async (req, res) => {
  const { id } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, { $pull: { categories: id } });
    res.json({ message: "Category removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Remove keyword
router.put("/profile/remove-keywords", authMiddleware, async (req, res) => {
  const { id } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, { $pull: { keywords: id } });
    res.json({ message: "Keyword removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
