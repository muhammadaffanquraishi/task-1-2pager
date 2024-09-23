const Booking = require('../models/booking.js');
const Service = require('../models/service.js');
const User = require('../models/user.js');

const createBooking = async (req, res) => {
  const { serviceId, bookingDate } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const service = await Service.findById(serviceId);

    if (!user || !service) {
      return res.status(404).json({ message: 'User or service not found' });
    }

    const booking = new Booking({
      user: req.user.id,  // Logged-in user
      service: serviceId,
      bookingDate,
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch bookings for a professional
const getProfessionalBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ service: req.user.id }).populate('service user');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  createBooking,
  getAllServices,
  getProfessionalBookings
}

