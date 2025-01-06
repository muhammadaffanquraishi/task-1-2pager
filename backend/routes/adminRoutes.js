const express = require("express");
const User = require("../models/user.js");
const Category = require("../models/Category");
const Keyword = require("../models/Keyword");
const Booking = require("./../models/booking.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// Fetch all categories
router.get("/categories", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories from the DB
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a new category (Admin only)
router.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { name } = req.body;

    try {
      const category = new Category({ name });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Add a new keyword to a category (Admin only)
router.post(
  "/categories/:categoryId/keywords",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { keyword } = req.body;
    const { categoryId } = req.params;

    try {
      const category = await Category.findById(categoryId);
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      const newKeyword = new Keyword({ keyword });
      await newKeyword.save();

      category.keywords.push(newKeyword._id); // Add keyword to category
      await category.save();

      res.status(201).json(newKeyword);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.put(
  "/users/:id/promote",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        user.role = "admin";
        await user.save();
        res.json({ message: "User promoted to admin" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Get total commission
router.get(
  "/admin/commissions",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalCommission = await Booking.aggregate([
        { $group: { _id: null, totalCommission: { $sum: "$commission" } } },
      ]);

      res.json({ totalCommission: totalCommission[0].totalCommission });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }); // Exclude the logged-in admin
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Suspend or Ban a user
router.put(
  "/users/:id/suspend",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        user.isSuspended = true; // or set a status like 'banned'
        await user.save();
        res.json({ message: "User suspended" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Route to rescind suspension
router.patch(
  "/users/:id/rescind",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        user.isSuspended = false; // or set the status back to 'active'
        await user.save();
        res.json({ message: "User suspension rescinded" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete a user
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const result = await User.deleteOne({ _id: req.params.id });

      if (result.deletedCount > 0) {
        res.json({ message: "User deleted" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/bookings", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("service")
      .populate("professional")
      .populate("user")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete(
  "/bookings/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      await booking.deleteOne();
      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

module.exports = router;
