const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  const booking = await Booking.create({
    user: req.user._id,
    event: req.body.eventId
  });

  res.status(201).json(booking);
};

const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id
  }).populate("event");

  res.json(bookings);
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
  cancelBooking
};