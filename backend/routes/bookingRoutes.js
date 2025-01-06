const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Booking = require('./../models/booking');
const { createBooking } = require('../contollers/bookingController');
const router = express.Router();

// Create a booking
router.post('/bookings', authMiddleware, createBooking);

// Update booking status
router.post("/professional/bookings/:bookingId/verify-otp", authMiddleware, async (req, res) => {
  const { bookingId } = req.params;
  const { otp } = req.body;

  try {
    // Ensure the logged-in user is a professional
    if (req.user.role !== "professional") {
      return res.status(403).json({ message: "Access denied. Professionals only." });
    }

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Check if the professional matches the booking
    if (booking.professional.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized for this booking." });
    }

    // Verify the OTP
    if (booking.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // Mark the booking as completed
    booking.status = "completed";
    await booking.save();

    res.status(200).json({ message: "Booking completed successfully.", booking });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;