const express = require('express');
const router = express.Router();
const authMiddleware = require('./../middleware/authMiddleware')
const Booking = require('./../models/booking');
const User = require('../models/user'); // Adjust path if necessary

router.post("/unavailability", authMiddleware, async (req, res) => {
  try {
    const { unavailableDates } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      unavailableDates,
    });
    res.json({ message: "Unavailability updated successfully" });
  } catch (error) {
    console.error("Error saving unavailability:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/unavailable-dates", authMiddleware, async (req, res) => {
  try {
    const professional = await User.findById(req.user.id).select(
      "unavailableDates"
    );
    if (!professional) {
      return res.status(404).json({ message: "Professional not found" });
    }
    res.json({ unavailableDates: professional.unavailableDates });
  } catch (error) {
    console.error("Error fetching unavailable dates:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get professional by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const professional = await User.findById(id)
      .populate('categories keywords')
      .exec();

    if (!professional || professional.role !== 'professional') {
      return res.status(404).json({ message: 'Professional not found' });
    }

    res.json(professional);
  } catch (error) {
    console.error('Error fetching professional:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:professionalId/booking-dates', async (req, res) => {
  try {
    const { professionalId } = req.params;
    const bookings = await Booking.find({ professional: professionalId }).select('bookingDate');
    const bookingDates = bookings.map(booking => booking.bookingDate);  // Get only dates
    res.json({ bookingDates });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;