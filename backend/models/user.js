const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "professional", "admin"],
      default: "user",
    },
    isSuspended:{
      type: Boolean,
      default: false,
    }, // Role field with default value
    fees: { type: Number }, // Fees per project or per hour
    availableHours: { type: Number }, // Available work hours per day
    availableDates: [{ type: Date }], // Array to store available dates
    otherDetails: { type: String }, // Any other professional details
    personalDetails: { type: String }, // Personal details for normal users
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Reference to Category model
      },
    ],
    keywords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Keyword", // Reference to Keyword model
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
