const express = require("express");
const ChatRoom = require("./../models/chatRoom");
const Message = require("./../models/message");
const User = require("./../models/user");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create or Fetch a Chat Room
router.post("/chat-room", authMiddleware, async (req, res) => {
  const { participantId } = req.body;

  try {
    // Check if a chat room already exists
    let chatRoom = await ChatRoom.findOne({
      participants: { $all: [req.user.id, participantId] },
    });

    if (!chatRoom) {
      // Create a new chat room if none exists
      chatRoom = new ChatRoom({
        participants: [req.user.id, participantId],
      });
      await chatRoom.save();
    }

    res.json(chatRoom);
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/chats", authMiddleware, async (req, res) => {
  try {
    const chats = await ChatRoom.find({ participants: req.user.id })
      .populate("participants", "name email") // Populate user details
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    // Format the chats for the response
    const formattedChats = chats.map((chat) => {
      const otherUser = chat.participants.find(
        (participant) => participant._id.toString() !== req.user.id
      );

      return {
        _id: chat._id,
        otherUser,
        lastMessage: chat.lastMessage?.text || "No messages yet",
      };
    });

    res.json(formattedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/chats", authMiddleware, async (req, res) => {
  const { participantId } = req.body;

  try {
    // Ensure the participant ID is provided
    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required." });
    }

    // Check if a chat room already exists
    let chatRoom = await ChatRoom.findOne({
      participants: { $all: [req.user.id, participantId] }, // Both users are in the room
    });

    // If it doesn't exist, create a new chat room
    if (!chatRoom) {
      chatRoom = new ChatRoom({
        participants: [req.user.id, participantId],
      });
      await chatRoom.save();
    }

    res.json({ chatRoom });
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/messages/:chatRoomId", authMiddleware, async (req, res) => {
  const { chatRoomId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Message content is required" });
  }

  try {
    const message = await Message.create({
      chatRoom: chatRoomId,
      sender: req.user.id,
      content,
    });

    // Update the chat room's lastMessage
    await ChatRoom.findByIdAndUpdate(chatRoomId, { lastMessage: message._id });

    res.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/chatRooms/:chatRoomId", authMiddleware, async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.chatRoomId).populate(
      "participants",
      "name email"
    );
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }
    res.json(chatRoom);
  } catch (error) {
    console.error("Error fetching chat room details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/messages/:chatRoomId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ chatRoom: req.params.chatRoomId })
      .populate("sender", "name email") // Populate sender details
      .sort({ createdAt: 1 }); // Sort messages by time

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/messages/:messageId", authMiddleware, async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Message content is required." });
  }

  try {
    // Find the message and ensure the logged-in user is the sender
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this message." });
    }

    // Update the message content
    message.content = content;
    await message.save();

    res.json({ message });
  } catch (error) {
    console.error("Error editing message:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.delete("/messages/:messageId", authMiddleware, async (req, res) => {
  const { messageId } = req.params;

  try {
    // Find the message and ensure the logged-in user is the sender
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this message." });
    }

    // Delete the message
    await message.remove();

    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error." });
  }
});


module.exports = router;
