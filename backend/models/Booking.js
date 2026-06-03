const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    ticketsCount: {
      type: Number,
      default: 1
    },

    attendeeName: {
      type: String
    },

    attendeePhone: {
      type: String
    },

    status: {
      type: String,
      default: "Booked"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);