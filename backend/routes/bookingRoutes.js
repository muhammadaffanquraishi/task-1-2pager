const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Booking = require('./../models/booking');
const { createBooking } = require('../contollers/bookingController');
const router = express.Router();

// Create a booking
router.post('/bookings', authMiddleware, createBooking);

// Update booking status
router.put('/user/bookings/:bookingId/status', authMiddleware, async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;
  
      // Check if the booking exists and belongs to the logged-in user
      const booking = await Booking.findOne({ _id: bookingId, user: req.user.id });
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found or not authorized' });
      }
  
      // Update the status
      booking.status = status;
      await booking.save();
  
      res.json({ message: 'Booking status updated successfully', booking });
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;