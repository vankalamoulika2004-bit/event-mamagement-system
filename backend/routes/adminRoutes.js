const express = require("express");

const { dashboardData } = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/dashboard", protect, admin, dashboardData);

module.exports = router;