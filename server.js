require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== CORS (VERY IMPORTANT) =====
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
  .catch((err) => console.log("Mongo Error:", err));

// ===== Schema =====
const bookingSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
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

    res.status(200).send("Booking Saved Successfully");
  } catch (err) {
    console.log("Save Error:", err);
    res.status(500).send("Server Error");
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const data = await Booking.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching bookings");
  }
});

// ===== Server Start =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
