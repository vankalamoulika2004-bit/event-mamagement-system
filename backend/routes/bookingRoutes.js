const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/my", protect, getMyBookings);

router.get("/:id", protect, getBookingById);

router.put("/:id", protect, cancelBooking);

module.exports = router;