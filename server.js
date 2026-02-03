require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// 🔥 CRITICAL — allow preflight for Netlify
app.use(cors());
app.options("*", cors());

app.use(express.json());

// ===== MongoDB =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

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
  res.send("API Running");
});

app.post("/book", async (req, res) => {
  console.log("BODY RECEIVED:", req.body); // 👈 debugging line

  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.send("Saved");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.get("/bookings", async (req, res) => {
  const data = await Booking.find();
  res.json(data);
});

// ===== Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started"));
