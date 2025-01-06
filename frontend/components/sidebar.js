import React, { useEffect, useState, } from "react";
import { Box, Button, Link, VStack } from "@chakra-ui/react";

const Sidebar = ({ role }) => {
  if (!role) {
    // If no role, render nothing (not authenticated)
    return null;
  }

  return (
    <Box
      position="fixed"
      top="4rem"
      left="0"
      bg="gray.700"
      color="white"
      width={["full", "250px"]}
      minHeight="100vh"
      p={4}
    >
      <VStack align="start" spacing={4}>
        {/* Conditionally render links based on role */}
        {role === "admin" ? (
          <>
            <Link
              href="/admin/dashboard"
              _hover={{ textDecoration: "none", color: "teal.300" }}
            >
              Admin Dashboard
            </Link>
            <Link
              href="/admin/categories"
              _hover={{ textDecoration: "none", color: "teal.300" }}
            >
              Manage Categories and Keywords
            </Link>
            <Link
              href="/admin/adminServicePage"
              _hover={{ textDecoration: "none", color: "teal.300" }}
            >
              Manage Services
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/dashboard"
              _hover={{ textDecoration: "none", color: "teal.300" }}
            >
              Dashboard
            </Link>
            <Link
              href="/userProfileForm"
              _hover={{ textDecoration: "none", color: "teal.300" }}
            >
              Add Details
            </Link>
          </>
        )}

        {/* Common links for all roles */}
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
        <Link
          href="/chat"
          _hover={{ textDecoration: "none", color: "teal.300" }}
        >
          Chat
        </Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;
