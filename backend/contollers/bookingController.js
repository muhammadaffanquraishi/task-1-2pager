const Booking = require("../models/booking.js");
const Service = require("../models/service.js");
const User = require("../models/user.js");

const createBooking = async (req, res) => {
  const { professionalId, serviceId, bookingDate } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const service = await Service.findById(serviceId);

    if (!user || !service) {
      return res.status(404).json({ message: "User or service not found" });
    }

    // Calculate amount, commission, and professionalAmount
    const amount = service.price; // Assuming `service.price` holds the cost of the service
    const commissionRate = parseFloat(process.env.COMMISSION_PERCENTAGE || 0.1); // Default to 10% if not set
    const commission = amount * commissionRate;
    const professionalAmount = amount - commission;

    // Create a new booking without amount fields initially
    const booking = new Booking({
      user: req.user.id, // The user who made the booking
      professional: professionalId, // The professional being hired
      service: serviceId, // The service being booked
      bookingDate: bookingDate, // The date of the booking
      amount: amount, // Total amount paid
      commission: commission, // Platform's commission
      professionalAmount: professionalAmount, // Amount paid to the professional
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
};
