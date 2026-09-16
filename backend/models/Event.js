const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    date: {
      type: String,
      required: [true, "Date is required"]
    },
    time: {
      type: String,
      default: "10:00 AM"
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Description is required"]
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    maxParticipants: {
      type: Number,
      default: 100,
      min: [1, "Max participants must be at least 1"]
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Completed"],
      default: "Open"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);