const express = require('express');
const authMiddleware = require('./../middleware/authMiddleware');
const User = require('./../models/user');
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

router.put("/profile/append-services", authMiddleware, async (req, res) => {
  const { services } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { services } });
    res.json({ message: "Services updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;