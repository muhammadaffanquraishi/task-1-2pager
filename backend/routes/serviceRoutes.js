const express = require('express');
const Service = require('../models/service');
const router = express.Router();

// Fetch all available services (Public route)
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;