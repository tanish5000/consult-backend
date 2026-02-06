require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== Middleware =====
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===== Schema =====
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
app.get("/", (req, res) => {
  res.send("API Running ✅");
});

app.post("/book", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const booking = new Booking(req.body);
    await booking.save();

    res.status(200).json({ message: "Booking Saved Successfully" });
  } catch (err) {
    console.error("❌ Save Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const data = await Booking.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ===== Server Start =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});