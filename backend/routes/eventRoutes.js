const express = require("express");

const {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(["/", "/all"], getEvents);

router.get(["/:id", "/event/:id"], getSingleEvent);

router.post(["/", "/event"], protect, admin, createEvent);

router.put(["/:id", "/updateEvent/:id"], protect, admin, updateEvent);

router.delete(["/:id", "/deleteEvent/:id"], protect, admin, deleteEvent);

module.exports = router;