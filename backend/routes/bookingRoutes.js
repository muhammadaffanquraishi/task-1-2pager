const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createBooking, getProfessionalBookings } = require('../contollers/bookingController');
const router = express.Router();

// Create a booking
router.post('/bookings', authMiddleware, createBooking);

// Fetch all bookings for a professional
router.get('/professionals/bookings', authMiddleware, getProfessionalBookings);

module.exports = router;