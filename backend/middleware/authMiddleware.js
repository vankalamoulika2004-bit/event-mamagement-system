const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // Automatically find or create a default user to bypass auth
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: "Demo Admin",
        email: "demo@evinto.com",
        password: "$2a$10$demohashedpasswordmock123", // mock hash
        role: "admin"
      });
    }
    
    // Attach user to request so that controllers (like bookings) don't throw TypeErrors
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth bypass middleware error:", error);
    next();
  }
};

module.exports = { protect };
