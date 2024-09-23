import React, { useState, useEffect } from "react";
import { Box, Flex, Link, Button, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Update state based on whether a token exists
  }, []);

  // Handle login redirection
  const handleLogin = () => {
    router.push("/login"); // Redirect to login page
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setIsAuthenticated(false); // Update state to reflect logout
    router.push("/login"); // Redirect to login page after logout
  };

  return (
    <Box bg="teal.500" px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Box fontWeight="bold" color="white">
          Service Booking
        </Box>
        <Flex alignItems={"center"}>
          <Link href="/" color="white" mr={4}>
            Home
          </Link>
          <Link href="/about" color="white" mr={4}>
            About
          </Link>
          <Link href="/services" color="white" mr={4}>
            Services
          </Link>
          <Link href="/contact" color="white">
            Contact
          </Link>
          <Button onClick={toggleColorMode} ml={4}>
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>

          {/* Conditional Login / Logout Button */}

          {isAuthenticated ? (
            <Button onClick={handleLogout} colorScheme="red" ml={4}>
              Logout
            </Button>
          ) : (
            <Button onClick={handleLogin} colorScheme="teal" ml={4}>
              Login
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
