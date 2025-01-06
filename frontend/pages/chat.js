import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast({
        title: "Error",
        description: "Failed to load chats. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  if (loading) {
    return (
      <Box p={4}>
        <Spinner size="xl" />
        <Text>Loading chats...</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Recent Chats</Heading>
      <VStack spacing={4} align="start">
        {chats.map((chat) => (
          <Box
            key={chat._id}
            p={4}
            borderWidth={1}
            borderRadius="md"
            width="100%"
            onClick={() => {
              // Navigate to chat room
              window.location.href = `/chat/${chat._id}`;
            }}
            cursor="pointer"
          >
            <Text fontWeight="bold">
              {chat.otherUser.name} {/* Display the other user's name */}
            </Text>
            <Text>{chat.lastMessage}</Text>
          </Box>
        ))}
      </VStack>

      <Button
        colorScheme="teal"
        mt={4}
        onClick={() => {
          // Navigate to new chat creation
          window.location.href = "/newChat";
        }}
      >
        + New Chat
      </Button>
    </Box>
  );
};

export default ChatPage;
