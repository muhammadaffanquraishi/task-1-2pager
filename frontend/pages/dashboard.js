import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  GridItem,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import withAuth from "./../pages/utils/withAuth";
import Sidebar from "@/components/sidebar";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalServices: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/data"
        );
        setDashboardData(response.data);

        const token = localStorage.getItem("token");

        // Fetch user details to determine role
        const userResponse = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const role = userResponse.data.role;
    
        // Fetch recent bookings based on role
        const bookingsResponse = await axios.get(
          role === "professional"
            ? "http://localhost:5000/api/history/professional/recent-bookings"
            : "http://localhost:5000/api/history/user/recent-bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
    
        setRecentBookings(bookingsResponse.data.slice(0, 5)); // Show top 5 recent bookings
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Text>{error}</Text>
      </Box>
    );
  }

  return (
    <Box display="flex">
      {/* <Sidebar/> */}
      <Box ml={["0", "250px"]} p={4} flex="1" minHeight="100vh">
        <Heading as="h1" size="lg" mb={6}>
          Welcome to the Dashboard
        </Heading>

        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          <GridItem
            w="100%"
            h="150px"
            bg="teal.500"
            borderRadius="md"
            p={4}
            color="white"
          >
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>{dashboardData.totalUsers}</StatNumber>
            </Stat>
          </GridItem>
          <GridItem
            w="100%"
            h="150px"
            bg="orange.500"
            borderRadius="md"
            p={4}
            color="white"
          >
            <Stat>
              <StatLabel>Total Bookings</StatLabel>
              <StatNumber>{dashboardData.totalBookings}</StatNumber>
            </Stat>
          </GridItem>
          <GridItem
            w="100%"
            h="150px"
            bg="purple.500"
            borderRadius="md"
            p={4}
            color="white"
          >
            <Stat>
              <StatLabel>Total Services</StatLabel>
              <StatNumber>{dashboardData.totalServices}</StatNumber>
            </Stat>
          </GridItem>
        </SimpleGrid>

        {/* Recent Bookings Section */}
        <Box mt={10}>
          <Heading as="h2" size="md" mb={4}>
            Recent Bookings
          </Heading>
          {recentBookings.length > 0 ? (
            <VStack align="start" spacing={4}>
              {recentBookings.map((booking) => (
                <Box
                  key={booking._id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  width="100%"
                  boxShadow="sm"
                >
                  <Text>
                    <strong>Service:</strong> {booking.service.name}
                  </Text>
                  <Text>
                    <strong>Professional:</strong> {booking.professional.name}
                  </Text>
                  <Text>
                    <strong>Date:</strong>{" "}
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </Text>
                  <Text>
                    <strong>Status:</strong> {booking.status}
                  </Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text>No recent bookings to display.</Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default withAuth(Dashboard);
