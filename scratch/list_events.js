const dotenv = require("dotenv");
dotenv.config({ path: "./backend/.env" });

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Event = require("./backend/models/Event");

async function listEvents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const events = await Event.find({});
    console.log(`Found ${events.length} events in database:`);
    events.forEach((evt, idx) => {
      console.log(`${idx + 1}. ID: ${evt._id} | Title: "${evt.title}" | Price: ₹${evt.price} | Category: ${evt.category || "N/A"} | Date: ${evt.date}`);
    });
  } catch (err) {
    console.error("Error querying events:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

listEvents();
