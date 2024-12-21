const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service", // The service being reviewed
    // required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who gave the review
    required: true,
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the professional being reviewed
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Rating is between 1 and 5
  },
  reviewText: {
    type: String,
    required: true, // The text content of the review
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
