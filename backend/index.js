const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const userRoutes = require('./routes/userRoutes');
const adminServiceRoutes = require('./routes/adminServiceRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const searchRoutes = require('./routes/searchRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const keywordRoutes = require('./routes/keywordRoutes.js');
const professionalRoutes = require('./routes/professionalRoutes');
const reviewRoutes = require('./routes/reviewRoutes.js')
const historyRoutes = require('./routes/historyRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');



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
app.use('/api/admin', adminServiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', userRoutes);
app.use('/api', serviceRoutes); 
app.use('/api', searchRoutes);
app.use('/api', bookingRoutes);
app.use('/api', paymentRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/keywords', keywordRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api', reviewRoutes)
app.use('/api/history', historyRoutes);
app.use('/api', chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
