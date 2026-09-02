const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@evinto.com" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      await User.create({
        name: "Admin User",
        email: "admin@evinto.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Default admin user created successfully (admin@evinto.com / admin123)");
    } else if (adminExists.role !== "admin") {
      adminExists.role = "admin";
      await adminExists.save();
      console.log("Updated admin user role to admin");
    }
  } catch (error) {
    console.error("Error seeding default admin user:", error);
  }
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing");
    }
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
    await seedAdmin();
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message || error);
    process.exit(1);
  }
};

module.exports = connectDB;