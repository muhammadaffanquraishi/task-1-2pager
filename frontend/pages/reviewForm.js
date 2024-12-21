import React, { useState } from 'react';
import { Box, Button, Input, Textarea, Select, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ReviewForm = () => {
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const toast = useToast();
  const router = useRouter();
  const { professionalId } = router.query; // Get professionalId from query parameters

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:5000/api/reviews/${professionalId}`, {
        rating,
        reviewText,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },  // Ensure token is sent
      });

      toast({
        title: 'Review submitted!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Clear the form
      setRating('');
      setReviewText('');
    } catch (error) {
      toast({
        title: 'Error submitting review',
        description: error.response?.data?.message || 'Server error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mt={6}>
      <Select placeholder="Select rating" value={rating} onChange={(e) => setRating(e.target.value)} required>
        <option value="5">5 - Excellent</option>
        <option value="4">4 - Very Good</option>
        <option value="3">3 - Good</option>
        <option value="2">2 - Fair</option>
        <option value="1">1 - Poor</option>
      </Select>

      <Textarea
        placeholder="Write your review here..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        required
        mt={4}
      />

      <Button type="submit" colorScheme="teal" mt={4}>
        Submit Review
      </Button>
    </Box>
  );
};

export default ReviewForm;