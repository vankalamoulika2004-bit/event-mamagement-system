const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

const dashboardData = async (req, res) => {
  const users = await User.countDocuments();

  const events = await Event.countDocuments();

  const bookings = await Booking.countDocuments();

  res.json({
    users,
    events,
    bookings
  });
};

module.exports = {
  dashboardData
};