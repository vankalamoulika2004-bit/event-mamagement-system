const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  console.warn("Could not set custom DNS servers:", dnsErr.message);
}

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

// 404 handler for unmatched routes (returns JSON instead of HTML)
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error("Express Error:", err.stack || err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Global process error handlers
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  try {
    await mongoose.connection.close();
  } catch (e) {
    console.error("Error closing database connection:", e);
  }
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Another server instance is likely running.`);
        process.exit(1);
      } else {
        console.error("Server error:", err);
      }
    });
  } catch (err) {
    console.error("Failed to initialize server:", err);
  }
};

startServer();
