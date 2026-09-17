const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

const dashboardData = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const events = await Event.countDocuments();
    const bookings = await Booking.countDocuments();
    const payments = await Payment.countDocuments();

    // Sum revenue from successful payments
    const successfulPayments = await Payment.find({ paymentStatus: "Successful" });
    const revenue = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Fetch detailed lists for admin console tabs
    const bookingsList = await Booking.find()
      .populate("user", "name email")
      .populate("event", "title price category date location")
      .sort({ createdAt: -1 });

    const paymentsList = await Payment.find()
      .populate("user", "name email")
      .populate("event", "title")
      .populate("booking")
      .sort({ createdAt: -1 });

    res.json({
      users,
      events,
      bookings,
      payments,
      revenue,
      bookingsList,
      paymentsList
    });
  } catch (error) {
    console.error("Admin Dashboard Data Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // Exclude password from response
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  dashboardData,
  getAllUsers
};
