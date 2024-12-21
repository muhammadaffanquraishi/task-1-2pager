const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createBooking, getProfessionalBookings } = require('../contollers/bookingController');
const router = express.Router();

// Create a booking
router.post('/bookings', authMiddleware, createBooking);

module.exports = router;