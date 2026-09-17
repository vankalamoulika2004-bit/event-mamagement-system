const express = require("express");

const { dashboardData, getAllUsers } = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/dashboard", protect, admin, dashboardData);
router.get("/users", protect, admin, getAllUsers);

module.exports = router;