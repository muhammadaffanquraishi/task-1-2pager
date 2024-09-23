import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Box, Heading, useToast } from "@chakra-ui/react";
import axios from "axios";

const ProfessionalAvailability = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [bookedDates, setBookedDates] = useState([]); // Dates already booked
  const toast = useToast();

  // Fetch booked dates from backend when component mounts
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/professionals/booked-dates",
          {
            headers: { Authorization: `Bearer ${token} ` },
          }
        );
        setBookedDates(response.data.bookedDates); // Assume backend returns an array of booked dates
      } catch (error) {
        toast({
          title: "Error fetching booked dates",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchBookedDates();
  }, []);

  const isBooked = (date) => {
    // Disable already booked dates
    return bookedDates.some(
      (bookedDate) =>
        new Date(bookedDate).toDateString() === date.toDateString()
    );
  };

  const handleSaveAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/profile/professionals/availability",
        {
          availableDates: selectedDates,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Availability saved successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error saving availability",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading>Select Available Dates</Heading>
      <DatePicker
        selected={null}
        onChange={(date) => setSelectedDates([...selectedDates, date])}
        inline
        excludeDates={bookedDates.map((date) => new Date(date))} // Gray out booked dates
        highlightDates={selectedDates.map((date) => new Date(date))}
        isClearable
        filterDate={(date) => !isBooked(date)} // Disable booked dates
      />
      <Button mt={4} colorScheme="teal" onClick={handleSaveAvailability}>
        Save Availability
      </Button>
    </Box>
  );
};

export default ProfessionalAvailability;
