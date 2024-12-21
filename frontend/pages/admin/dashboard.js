import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Text,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import withAuth from "../utils/withAuth";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const toast = useToast();
  const router = useRouter();
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    const fetchTotalCommission = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/commissions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure you're sending the token
            },
          }
        );
        setTotalCommission(response.data.totalCommission);
      } catch (error) {
        console.error("Error fetching total commission:", error);
      }
    };

    fetchTotalCommission();
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        console.log("Sending request to /api/auth/me..."); // Debug log

        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response from /api/auth/me:", response.data); // Log response

        const loggedInAdminId = response.data.id; // Store admin ID
        console.log("Logged-in admin ID:", loggedInAdminId);
  
        if (response.data.role !== "admin") {
          router.push("/");
          return;
        }
  
        // Fetch users and filter out the current admin
        const fetchUsers = async () => {
          try {
            const usersResponse = await axios.get(
              "http://localhost:5000/api/admin/users",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            console.log("All users fetched:", usersResponse.data);  
  
            const filteredUsers = usersResponse.data.filter(
              (user) => user._id !== loggedInAdminId // Exclude the current admin
            );
            
            console.log("Filtered users:", filteredUsers);
            setUsers(filteredUsers);
          } catch (error) {
            toast({
              title: "Error fetching users",
              description: error.response?.data?.message || "Server error",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        };
  
        fetchUsers();
      } catch (error) {
        router.push("/");
      }
    };
  
    checkAdmin();
  }, [toast]);
  

  const handleSuspendUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/suspend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isSuspended: true } : user
        )
      );
      toast({
        title: "User suspended",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error suspending user",
        description: error.response?.data?.message || "Server error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRescindSuspension = async (userId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/rescind`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isSuspended: false } : user
        )
      );
      toast({
        title: "User suspension revoked",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error revoking suspension",
        description: error.response?.data?.message || "Server error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
      toast({
        title: "User deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting user",
        description: error.response?.data?.message || "Server error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box display="flex">
      {/* <Sidebar/> */}
      <Box ml={["0", "250px"]} p={4} flex="1" minHeight="100vh">
        <Heading as="h1" size="lg" mb={6}>
          Admin Dashboard
        </Heading>

        <Text fontSize="xl" fontWeight="bold">
          Total Commission Earned: ${totalCommission.toFixed(2)}
        </Text>

        <Table variant="simple" borderRadius="md" boxShadow="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user._id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.isSuspended ? "Suspended" : "Active"}</Td>
                <Td>
                  {!user.isSuspended ? (
                    <Button
                      colorScheme="yellow"
                      size="sm"
                      onClick={() => handleSuspendUser(user._id)}
                      mr={2}
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={() => handleRescindSuspension(user._id)}
                      mr={2}
                    >
                      Revoke Suspension
                    </Button>
                  )}

                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default withAuth(AdminDashboard);
