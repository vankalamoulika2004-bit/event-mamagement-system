const Event = require("../models/Event");

const createEvent = async (req, res) => {
  const event = await Event.create(req.body);

  res.status(201).json(event);
};

const getEvents = async (req, res) => {
  const events = await Event.find();

  res.json(events);
};

const getSingleEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  res.json(event);
};

const updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(event);
};

const deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);

  res.json({
    message: "Event deleted"
  });
};

module.exports = {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent
};