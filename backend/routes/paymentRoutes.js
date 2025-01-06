// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('./../middleware/authMiddleware');
const adminMiddleware = require('./../middleware/adminMiddleware');
const Payment = require('../models/payment');
const Booking = require('../models/booking'); // Import Booking model

// Mock payment endpoint
router.post('/payments', async (req, res) => {
  const { cardNumber, expiryDate, cvv, amount, professionalId, serviceId, bookingId } = req.body;

  try {
    // Simulate payment validation
    if (cardNumber.length !== 16 || cvv.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid payment details' });
    }
     // Calculate commission (10% of the total amount)
     const commissionRate = parseFloat(process.env.COMMISSION_PERCENTAGE); // Convert to number
     const commission = amount * commissionRate;
     const professionalAmount = amount - commission;
     
     // Ensure that bookingId, serviceId, and professionalId are valid
    if (!serviceId || !bookingId || !professionalId) {
      return res.status(400).json({ message: 'Missing required information' });
    }

    // Simulate successful payment
    const paymentSuccess = Math.random() > 0.2;

    if (paymentSuccess) {
      // Save payment data (e.g., in a Payment model)
      const payment = {
        amount,               // Total amount paid
        commission,           // Commission taken by the platform
        professionalAmount,   // Amount to be paid to the professional
        professionalId,       // Professional who the amount is paid to    
        serviceId,            // Related service
        bookingId,            // Related booking
      };
      
      // Save payment data in the database (if necessary)
      await Payment.create(payment);

      // Update booking with payment details
      await Booking.findByIdAndUpdate(bookingId, {
        amount,
        commission,
        professionalAmount,
        status: "confirmed"  // Optionally update booking status after payment
      });

      return res.status(200).json({ success: true, message: 'Payment processed successfully', payment });
    } else {
      return res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Fetch total commission for admin
router.get("/admin/commissions", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalCommission = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$commission" } } },
    ]);

    const total = totalCommission[0]?.total || 0;
    res.json({ totalCommission: total });
  } catch (error) {
    console.error("Error fetching total commissions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch total earnings for a professional
router.get("/professional/earnings", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "professional") {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalEarnings = await Booking.aggregate([
      { $match: { professional: req.user.id } },
      { $group: { _id: null, total: { $sum: "$professionalAmount" } } },
    ]);

    const total = totalEarnings[0]?.total || 0;
    res.json({ totalEarnings: total });
  } catch (error) {
    console.error("Error fetching total earnings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch total spent amount for a user
router.get("/user/spent", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalSpent = await Booking.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const total = totalSpent[0]?.total || 0;
    res.json({ totalSpent: total });
  } catch (error) {
    console.error("Error fetching total spent amount:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;