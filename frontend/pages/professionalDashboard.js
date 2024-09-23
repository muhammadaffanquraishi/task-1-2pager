import React, { useState, useEffect } from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';
import axios from 'axios';

const ProfessionalDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/professionals/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <Box p={4}>
      <Heading as="h2" mb={6}>
        Your Bookings
      </Heading>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <Box key={booking._id} p={4} mb={4} border="1px solid #ccc">
            <Text>Service: {booking.service.name}</Text>
            <Text>Date: {new Date(booking.bookingDate).toLocaleDateString()}</Text>
          </Box>
        ))
      ) : (
        <Text>No bookings found.</Text>
      )}
    </Box>
  );
};

export default ProfessionalDashboard;