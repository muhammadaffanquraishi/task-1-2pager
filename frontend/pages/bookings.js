import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  VStack,
  Spinner,
  useToast,
  Button,
} from "@chakra-ui/react";
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is an admin
  const toast = useToast();

  const fetchUserRoleAndBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Fetch user role
      const userResponse = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const role = userResponse.data.role;
      setUserRole(role);
      setIsAdmin(role === "admin");

      // Fetch bookings based on role
      const bookingsResponse = await axios.get(
        role === "admin"
          ? "http://localhost:5000/api/admin/bookings" // Admin: All bookings
          : role === "professional"
          ? "http://localhost:5000/api/history/professional/bookings" // Professional: Their bookings
          : "http://localhost:5000/api/history/user/bookings", // User: Their bookings
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(bookingsResponse.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings((prevBookings) =>
        prevBookings.filter((b) => b._id !== bookingId)
      );
      toast({
        title: "Booking deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "Failed to delete booking. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleOtpSubmission = async (bookingId, otp) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:5000/api/professional/bookings/${bookingId}/verify-otp`,
        { otp },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b._id === bookingId ? { ...b, status: response.data.booking.status } : b
        )
      );
  
      toast({
        title: "Booking marked as completed.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: "Failed to complete booking. Please check the OTP.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUserRoleAndBookings();
  }, [toast]);

  if (loading) {
    return (
      <Box p={4}>
        <Spinner size="xl" />
        <Text>Loading bookings...</Text>
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Box p={4}>
        <Heading size="md" mb={4}>
          Bookings
        </Heading>
        <Text>No bookings found.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        {isAdmin ? "All Bookings" : "My Bookings"}
      </Heading>
      <VStack align="start" spacing={4}>
        {bookings.map((booking) => (
          <Box
            key={booking._id}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            width="100%"
          >
            <Text>
              <strong>Service: </strong> {booking.service.name}
            </Text>
            {userRole === "user" ? (

              <Text>
              <strong>Professional: </strong> {booking.professional.name}
            </Text>):(
            <Text>
              <strong>User: </strong> {booking.user.name}
            </Text>
            )}
            <Text>
              <strong>Booking Date: </strong>{" "}
              {new Date(booking.bookingDate).toLocaleDateString()}
            </Text>
            <Text>
              <strong>Status: </strong> {booking.status}
            </Text>
            {userRole === "user" && booking.otp && (
              <Text>
                <strong>Booking OTP: </strong> {booking.otp}
              </Text>
            )}

            {/* Button for Completing the Booking */}
            {userRole === "professional" && booking.status === "confirmed" && (
              <Box mt={4}>
              <Input
                placeholder="Enter OTP"
                size="sm"
                onChange={(e) =>
                  setBookings((prevBookings) =>
                    prevBookings.map((b) =>
                      b._id === booking._id ? { ...b, enteredOtp: e.target.value } : b
                    )
                  )
                }
              />
              <Button
                mt={2}
                colorScheme="green"
                size="sm"
                onClick={() =>
                  handleOtpSubmission(booking._id, booking.enteredOtp)
                }
              >
                Complete Booking
              </Button>
            </Box>
            )}

            {/* Admin-only Delete Button */}
            {isAdmin && (
              <Button
                mt={4}
                colorScheme="red"
                size="sm"
                onClick={() => handleDeleteBooking(booking._id)}
              >
                Delete Booking
              </Button>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Bookings;
