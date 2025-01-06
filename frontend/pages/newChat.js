import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const NewChatPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/chats",
        { participantId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Navigate to the chat room
      window.location.href = `/chat/${response.data.chatRoom._id}`;
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box p={4}>
        <Spinner size="xl" />
        <Text>Loading users...</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Start New Chat</Heading>
      <VStack spacing={4} align="start">
        {users.map((user) => (
          <Box
            key={user._id}
            p={4}
            borderWidth={1}
            borderRadius="md"
            width="100%"
            onClick={() => startChat(user._id)}
            cursor="pointer"
          >
            <Text fontWeight="bold">{user.name}</Text>
            <Text>{user.email}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default NewChatPage;
