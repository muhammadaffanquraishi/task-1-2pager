import React, { useState, useEffect } from "react";
import { Box, Select, Button, Input, useToast } from "@chakra-ui/react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router";

const BookingForm = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const toast = useToast();
  const router = useRouter();
  const { professionalId } = router.query; // Get professionalId from query parameters

  // Fetch services offered by the professional
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/services?professionalId=${professionalId}`);
        setServices(response.data);
      } catch (error) {
        toast({
          title: "Error fetching services",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    if (professionalId) {
      fetchServices();
    }
  }, [professionalId, toast]);

  // Handle form submission to create a booking
  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    console.log("Service ID:", selectedService);
    console.log("Professional ID:", professionalId);
    console.log("Booking Date:", selectedDate);
    console.log("Token:", token);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          serviceId: selectedService,
          professionalId,
          bookingDate: selectedDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const bookingId = response.data._id; // Capture booking ID from response

      toast({
        title: "Booking created successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to PaymentForm page with the required IDs as query parameters
      router.push(
        `/paymentForm?professionalId=${professionalId}&serviceId=${selectedService}&bookingId=${bookingId}`
      );
    } catch (error) {
      toast({
        title: "Error creating booking",
        status: "error",
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
        Proceed to Payment
      </Button>
    </Box>
  );
};

export default BookingForm;
