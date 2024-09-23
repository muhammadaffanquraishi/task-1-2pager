import React, { useState, useEffect } from 'react';
import { Box, Select, Button, Input, useToast } from '@chakra-ui/react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingForm = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const toast = useToast();

  // Fetch available services (professionals)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching services',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchServices();
  }, []);

  // Handle form submission to create a booking
  const handleBooking = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        serviceId: selectedService,
        bookingDate: selectedDate,
      });

      toast({
        title: 'Booking created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error creating booking',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Select
        placeholder="Select a Service"
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
      >
        {services.map((service) => (
          <option key={service._id} value={service._id}>
            {service.name} - ${service.price}
          </option>
        ))}
      </Select>

      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        minDate={new Date()} // Prevent past dates
      />

      <Button mt={4} colorScheme="teal" onClick={handleBooking}>
        Book Service
      </Button>
    </Box>
  );
};

export default BookingForm;