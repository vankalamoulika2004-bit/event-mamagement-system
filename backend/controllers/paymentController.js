const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

const savePayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, cardDetails, upiId, bankName } = req.body;

    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Missing required payment fields" });
    }

    // Validate fields based on payment method
    if (paymentMethod === "Credit/Debit Card") {
      if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
        return res.status(400).json({ message: "Invalid card details" });
      }
      const cardRegex = /^\d{16}$/;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const cvvRegex = /^\d{3,4}$/;
      if (!cardRegex.test(cardDetails.cardNumber.replace(/\s+/g, ""))) {
        return res.status(400).json({ message: "Card number must be 16 digits" });
      }
      if (!expiryRegex.test(cardDetails.expiryDate)) {
        return res.status(400).json({ message: "Expiry date must be in MM/YY format" });
      }
      if (!cvvRegex.test(cardDetails.cvv)) {
        return res.status(400).json({ message: "CVV must be 3 or 4 digits" });
      }
    } else if (paymentMethod === "UPI") {
      if (!upiId) {
        return res.status(400).json({ message: "UPI ID is required" });
      }
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiRegex.test(upiId)) {
        return res.status(400).json({ message: "Invalid UPI ID format" });
      }
    } else if (paymentMethod === "Net Banking") {
      if (!bankName) {
        return res.status(400).json({ message: "Bank name is required" });
      }
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Save payment
    const payment = await Payment.create({
      booking: bookingId,
      amount,
      paymentMethod,
      cardDetails: paymentMethod === "Credit/Debit Card" ? {
        cardNumber: cardDetails.cardNumber.replace(/\s+/g, ""),
        expiryDate: cardDetails.expiryDate,
        cvv: cardDetails.cvv
      } : undefined,
      upiId: paymentMethod === "UPI" ? upiId : undefined,
      bankName: paymentMethod === "Net Banking" ? bankName : undefined,
      paymentStatus: "Successful"
    });

    // Update booking status
    booking.status = "Paid";
    await booking.save();

    res.status(201).json({
      success: true,
      message: "Payment saved successfully",
      payment
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  savePayment
};