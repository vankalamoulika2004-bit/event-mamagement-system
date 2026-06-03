const express = require("express");

const {
  savePayment
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Payment route");
});
router.post("/", protect, savePayment);

module.exports = router;