// server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== CORS FIX FOR NETLIFY =====
app.use(
  cors({
    origin: [
      "https://697e47becb88edab5a233fc0--papaya-sunburst-acd432.netlify.app",
      "http://localhost:5500",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ===== Middlewares =====
app.use(express.json());

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===== Booking Schema =====
const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

// ===== Routes =====

// Health check
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Save booking
app.post("/book", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBooking = new Booking({ name, email, phone, message });
    await newBooking.save();

    res.status(200).json({ message: "✅ Booking saved successfully" });
  } catch (error) {
    console.error("❌ Error saving booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all bookings
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
