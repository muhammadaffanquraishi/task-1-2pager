const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // Reference to the Service model
      required: true,
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensure this matches the User model name
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    otp: { type: String },
    amount: { type: Number, required: true }, // Total amount paid
    commission: { type: Number, required: true }, // Platform's commission
    professionalAmount: { type: Number, required: true }, // Amount paid to the professional
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
