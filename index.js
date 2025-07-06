const express = require("express");
const axios = require("axios");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Croak Gateway Live!");
});

app.post("/place-order", async (req, res) => {
  try {
    const {
      apiKey,
      apiSecret,
      symbol,
      side,
      orderType,
      qty,
      price,
      timeInForce
    } = req.body;

    const timestamp = Date.now().toString();
    const recvWindow = "5000";

    let params = {
      category: "linear",
      symbol,
      side,
      orderType,
      qty,
      timeInForce,
      price,
    };

    const paramStr = Object.entries(params)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");

    const signaturePayload = `${timestamp}${apiKey}${recvWindow}${paramStr}`;
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(signaturePayload)
      .digest("hex");

    const response = await axios.post(
      "https://api.bybit.com/v5/order/create",
      params,
      {
        headers: {
          "X-BYBIT-API-KEY": apiKey,
          "X-BYBIT-API-SIGN": signature,
          "X-BYBIT-API-TIMESTAMP": timestamp,
          "X-BYBIT-API-RECV-WINDOW": recvWindow,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ Order Error:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Order failed",
      details: error?.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
