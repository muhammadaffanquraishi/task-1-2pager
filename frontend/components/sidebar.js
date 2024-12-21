import React, { useEffect, useState } from "react";
import { Box, Button, Link, VStack } from "@chakra-ui/react";
import axios from "axios";

const Sidebar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is logged in

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false); // If no token, user is not authenticated
      return;
    }
    setIsAuthenticated(true); // If token exists, user is authenticated

    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data.role === "admin");
      } catch (error) {
        console.error("Error checking admin status", error);
      }
    };

    checkAdmin();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      bg="gray.700"
      color="white"
      width={["full", "250px"]}
      height="100vh"
      p={4}
    >
      <VStack align="start" spacing={4}>
        {/* Conditionally render the Admin Dashboard link or User Dashboard link*/}
        {isAdmin ? (
          <Link
            href="/admin/dashboard"
            _hover={{ textDecoration: "none", color: "teal.300" }}
          >
            Admin Dashboard
          </Link>
        ) : (
          <Link
            href="/dashboard"
            _hover={{ textDecoration: "none", color: "teal.300" }}
          >
            Dashboard
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/admin/categories"
            _hover={{ textDecoration: "none", color: "teal.300" }}
          >
            Manage Categories and Keywords
          </Link>
        )}
         {isAdmin && (
          <Link
            href="/admin/adminServicePage"
            _hover={{ textDecoration: "none", color: "teal.300" }}
          >
            Manage Services
          </Link>
        )}
        <Link
          href="/profile"
          _hover={{ textDecoration: "none", color: "teal.300" }}
        >
          Profile
        </Link>
        <Link
          href="/bookings"
          _hover={{ textDecoration: "none", color: "teal.300" }}
        >
          Bookings
        </Link>
        {!isAdmin &&
        <Link href="/userProfileForm"
        _hover={{ textDecoration: "none", color: "teal.300" }}
        >
          Add Details
        </Link>
        }
      </VStack>
    </Box>
  );
};

export default Sidebar;
