const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,  // Total amount paid by the user
  },
  commission: {
    type: Number,
    required: true,  // Commission taken by the platform
  },
  professionalAmount: {
    type: Number,
    required: true,  // Amount paid to the professional
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the professional
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',  // Reference to the service
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',  // Reference to the related booking
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically store the payment creation time
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
