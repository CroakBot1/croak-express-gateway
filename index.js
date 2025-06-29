const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🟢 Croak Gateway is Live!");
});

app.post("/trade", async (req, res) => {
  try {
    const { symbol, side, qty } = req.body;
    // Simulated trade for now (real trade requires Bybit API credentials)
    res.json({ success: true, message: `Executed ${side} ${qty} ${symbol}` });
  } catch (err) {
    console.error("Trade error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
