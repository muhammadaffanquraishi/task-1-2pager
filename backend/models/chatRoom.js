const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User/Professional/Admin
      required: true,
    },
  ],
  isAdminRoom: {
    type: Boolean,
    default: false, // Indicates if the chat room involves Admin
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message", // Reference to the latest message in the chat
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;
