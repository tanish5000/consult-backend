// server.js

require("dotenv").config(); // load .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB using .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Schema
const BookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});

const Booking = mongoose.model("Booking", BookingSchema);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API to save booking
app.post("/book", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(200).send("✅ Booking saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error saving booking");
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
