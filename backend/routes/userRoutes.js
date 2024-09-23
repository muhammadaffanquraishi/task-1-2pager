const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Save professional's availability
router.post('/profile/professionals/availability', authMiddleware, async (req, res) => {
  const { availableDates } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user.role !== 'professional') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    user.availableDates = availableDates;
    await user.save();

    res.json({ message: 'Availability updated successfully', availableDates: user.availableDates });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get professional's booked dates
router.get('/professionals/booked-dates', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ service: req.user.id }); // Assuming Booking model tracks the service provider
    const bookedDates = bookings.map((booking) => booking.bookingDate);

    res.json({ bookedDates });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update professional profile with keywords
router.put('/profile/professional', authMiddleware, async (req, res) => {
  const { keywords, categories } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user.role !== 'professional') {
      return res.status(403).json({ message: 'Not authorized to update professional details' });
    }

    // Assign selected keywords and categories to the professional
    user.keywords = keywords;
    user.categories = categories;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;