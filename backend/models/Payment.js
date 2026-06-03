const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["Credit/Debit Card", "UPI", "Net Banking"],
      required: true
    },

    cardDetails: {
      cardNumber: String,
      expiryDate: String,
      cvv: String
    },

    upiId: String,

    bankName: String,

    paymentStatus: {
      type: String,
      default: "Successful"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);