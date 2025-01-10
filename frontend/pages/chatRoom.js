import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Text, Spinner, Input, Button, VStack } from "@chakra-ui/react";
import axios from "axios";

const ChatRoom = () => {
  const router = useRouter();
  const { id: chatRoomId } = router.query; // Extract chatRoomId from the URL
  const [otherUserName, setOtherUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // State for new message
  const [loading, setLoading] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null); // For editing/deleting messages
  const [editMode, setEditMode] = useState(false); // To track if editing a message
  const [editContent, setEditContent] = useState(""); // Content for editing

  useEffect(() => {
    if (chatRoomId) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5000/api/messages/${chatRoomId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
    const fetchChatRoomDetails = async () => {
      if (!chatRoomId) return;

      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Logged-in user's ID

        console.log("Chat Room ID:", chatRoomId);
        console.log("Logged-in User ID:", userId);

        const response = await axios.get(
          `http://localhost:5000/api/chatRooms/${chatRoomId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const chatRoom = response.data;

        const otherParticipant = chatRoom.participants.find(
          (participant) => participant._id !== userId // Ensure types match (string vs ObjectId)
        );
        setOtherUserName(otherParticipant?.name || "Unknown");
      } catch (error) {
        console.error("Error fetching chat room details:", error);
      }
    };

    fetchChatRoomDetails();
  }, [chatRoomId]);

  // Function to send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Avoid sending empty messages

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/messages/${chatRoomId}`,
        { content: newMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prevMessages) => [...prevMessages, response.data]); // Update the message list
      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

   // Function to edit a message
   const editMessage = async () => {
    if (!editContent.trim()) return; // Avoid saving empty edits

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/messages/${selectedMessageId}`,
        { content: editContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === selectedMessageId ? { ...msg, content: response.data.message.content } : msg
        )
      );
      setEditMode(false);
      setEditContent("");
      setSelectedMessageId(null);
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  // Function to delete a message
  const deleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

   // Handle Enter key press
   const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default newline behavior
      sendMessage();
    }
  };

  if (loading) {
    return (
      <Box>
        <Spinner />
        <Text>Loading chat...</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Text fontWeight="bold" mb={4}>
        Chat Room: {chatRoomId}
      </Text>
      {/* <Text fontWeight="bold" mb={4}>
        Chat with: {otherUserName}
      </Text> */}

      <VStack align="start" spacing={4} mb={4}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <Box key={message._id} p={2} borderWidth={1} borderRadius="md">
              <Text>
                <strong>{message.sender.name} :</strong> {message.content}
              </Text>
            </Box>
          ))
        ) : (
          <Text>No messages yet.</Text>
        )}
      </VStack>

      {/* Message Input and Send Button */}
      <Box display="flex" gap={2}>
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button colorScheme="teal" type="submit" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRoom;
