const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://mams-frontend.netlify.app', 'http://localhost:3000']
        : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
const assignmentRoutes = require("./routes/assignmentRoutes");
const authRoutes = require("./routes/authRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const transferRoutes = require("./routes/transferRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const assetsRoutes = require("./routes/assetsRoutes");

// Use routes
app.use("/api/assignments", assignmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/auth", authRoutes);

// Connect MongoDB
console.log("Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
    console.error("❌ MongoDB Connection Error Details:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Full error:", err);
});

// Simple test route
app.get("/", (req, res) => {
    res.send("Military Asset Management Backend is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
