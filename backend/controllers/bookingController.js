const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  const { eventId, ticketsCount, attendeeName, attendeePhone } = req.body;
  const booking = await Booking.create({
    user: req.user._id,
    event: eventId,
    ticketsCount: ticketsCount || 1,
    attendeeName,
    attendeePhone
  });

  res.status(201).json(booking);
};

const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id
  }).populate("event");

  res.json(bookings);
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("event")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security check: Only owner or admin can retrieve
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this booking" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  booking.status = "Cancelled";

  await booking.save();

  res.json({
    message: "Booking cancelled"
  });
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
};