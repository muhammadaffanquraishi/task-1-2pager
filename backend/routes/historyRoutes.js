const express = require("express");
const adminMiddleware = require("./../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const Review = require("./../models/review");
const Booking = require("./../models/booking");
const Payment = require("./../models/payment");
const router = express.Router();

// Get all bookings for admin
router.get(
  "/admin/bookings",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("service professional user")
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Get booking history for the logged-in user
router.get("/user/bookings", authMiddleware, async (req, res) => {
  try {
    // console.log("Fetching bookings for user:", req.user.id); // Log user ID

    const bookings = await Booking.find({ user: req.user.id })
      .populate("service professional")
      .sort({ createdAt: -1 });

    // console.log("Bookings found:", bookings); // Log bookings
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch recent bookings (last 3 days) for the logged-in user
router.get("/user/recent-bookings", authMiddleware, async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const bookings = await Booking.find({
      user: req.user.id,
      bookingDate: { $gte: threeDaysAgo }, // Filter bookings within the last 3 days
    })
      .populate("service")
      .populate("user") // Populate related fields
      .sort({ createdAt: -1 }); // Sort by booking date (most recent first)

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching recent bookings:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch bookings for a specific professional
router.get("/professional/bookings", authMiddleware, async (req, res) => {
  try {
    // Ensure only professionals can access this route
    if (req.user.role !== "professional") {
      return res.status(403).json({ message: "Access denied" });
    }
    const bookings = await Booking.find({ professional: req.user.id })
      .populate("service user")
      .select("-otp")
      .sort({ bookingDate: -1 }); // Sort by booking date (most recent first)

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching professional bookings:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch recent bookings for a professional
router.get(
  "/professional/recent-bookings",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "professional") {
        return res.status(403).json({ message: "Access denied" });
      }

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const bookings = await Booking.find({
        professional: req.user.id,
        bookingDate: { $gte: threeDaysAgo }, // Filter bookings within the last 3 days
      })
        .populate("service user") // Populate related fields
        .sort({ bookingDate: -1 }); // Sort by booking date (most recent first)

      res.json(bookings);
    } catch (error) {
      console.error("Error fetching recent bookings for professional:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Get payment history for the logged-in user
router.get("/user/payments", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("service professional booking")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get review history for the logged-in user
router.get("/user/reviews", authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate("professional")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get review history for the logged-in professional
router.get("/professional/reviews", authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ professional: req.user.id })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
