const mongoose = require("mongoose");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

const createEvent = async (req, res) => {
  try {
    const { title, category, date, time, location, description, image, price, maxParticipants, status } = req.body;

    if (!title || !category || !date || !location || !description || price === undefined) {
      return res.status(400).json({ message: "Please fill all required fields (Title, Category, Date, Location, Description, Price)" });
    }

    const event = await Event.create({
      title: title.trim(),
      category,
      date,
      time: time || "10:00 AM",
      location: location.trim(),
      description,
      image: image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      price: Number(price),
      maxParticipants: Number(maxParticipants) || 100,
      status: status || "Open"
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ message: error.message || "Failed to create event" });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    const activeBookings = await Booking.find({ status: { $ne: "Cancelled" } });

    const bookingsByEvent = {};
    activeBookings.forEach((b) => {
      const eId = b.event?.toString();
      if (eId) {
        bookingsByEvent[eId] = (bookingsByEvent[eId] || 0) + (b.ticketsCount || 1);
      }
    });

    const eventsWithSeats = events.map((ev) => {
      const evObj = ev.toObject();
      const booked = bookingsByEvent[ev._id.toString()] || 0;
      evObj.bookedTickets = booked;
      evObj.availableSeats = Math.max(0, (ev.maxParticipants || 100) - booked);
      return evObj;
    });

    res.json(eventsWithSeats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Calculate booked seats
    const activeBookings = await Booking.find({
      event: event._id,
      status: { $ne: "Cancelled" }
    });

    const bookedTickets = activeBookings.reduce((sum, b) => sum + (b.ticketsCount || 1), 0);
    const availableSeats = Math.max(0, (event.maxParticipants || 100) - bookedTickets);

    const eventData = event.toObject();
    eventData.bookedTickets = bookedTickets;
    eventData.availableSeats = availableSeats;

    res.json(eventData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent
};