const express = require('express') ;
const User = require('./../models/user.js'); 
const Booking = require('./../models/booking.js'); 
const Service = require('../models/service.js'); 

const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalServices = await Service.countDocuments();

    res.json({
      totalUsers,
      totalBookings,
      totalServices,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;