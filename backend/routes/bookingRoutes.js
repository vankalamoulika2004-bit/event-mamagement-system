const express = require("express");

const {
  createBooking,
  getMyBookings,
  cancelBooking
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/my", protect, getMyBookings);

router.put("/:id", protect, cancelBooking);

module.exports = router;