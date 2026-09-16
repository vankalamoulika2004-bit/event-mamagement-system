const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Health check routes
app.get(["/", "/api"], (req, res) => {
  res.status(200).json({ status: "ok", message: "Evinto API is running", timestamp: new Date() });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log(`[Contact] From: ${name} <${email}> | Subject: ${subject}`);
  res.status(200).json({ success: true, message: "Message received successfully" });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error("Express Error:", err.stack || err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize server:", err);
  }
};

startServer();