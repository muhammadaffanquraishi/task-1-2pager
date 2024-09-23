const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const cors = require("cors");
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const userRoutes = require('./routes/userRoutes');
const adminServiceRoutes = require('./routes/adminServiceRoutes');
const serviceRoutes = require('./routes/serviceRoutes');


dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // The frontend's URL
    credentials: true,
  })
);

// Define routes
app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api',userRoutes);
app.use('/api/admin', adminServiceRoutes);
app.use('/api', serviceRoutes);  // Register the public service routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
