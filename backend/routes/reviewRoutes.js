const express = require('express');
const Review = require('../models/review');
const Booking = require('./../models/booking')
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add a review (requires authentication)
router.post('/reviews/:professionalId', authMiddleware, async (req, res) => {
  const { rating, reviewText } = req.body;
  const { professionalId } = req.params;
  console.log(professionalId);

  try {
    // Check if the user has a confirmed booking with the professional
    const booking = await Booking.findOne({
      user: req.user.id,
      professional: professionalId,
      status: "completed", // Ensure the booking is completed
    });

    if (!booking) {
      return res.status(403).json({
        message: "You can only write a review for professionals you have booked and completed a service with.",
      });
    }
    
    const newReview = new Review({
      user: req.user.id,
      professional: professionalId,
      service: booking.service, // Include the service ID from the booking
      rating,
      reviewText,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Check eligibility before writing a review
router.get('/bookings/eligibility/:professionalId', authMiddleware, async (req, res) => {
  const { professionalId } = req.params;

  try {
    // Check if the user has completed a booking with the professional
    const booking = await Booking.findOne({
      user: req.user.id,
      professional: professionalId,
      status: "completed",
    });

    if (booking) {
      return res.json({ eligible: true });
    }

    res.json({ eligible: false });
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all reviews for a specific professional
router.get('/reviews/:professionalId', async (req, res) => {
  const { professionalId } = req.params;

  try {
    const reviews = await Review.find({ professional: professionalId })
      .populate('user', 'name')  // Populate the reviewer's name
      .sort({ createdAt: -1 });  // Sort reviews by newest first

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a review (optional, for admins or the user who wrote it)
router.delete('/reviews/:reviewId', authMiddleware, async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Allow only the admin or the user who wrote the review to delete it
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this review' });
    }

    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;