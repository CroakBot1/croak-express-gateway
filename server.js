const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// 🔐 Signature Generator
function generateSignature(secret, params) {
  const orderedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(orderedParams).digest('hex');
}

// 🚀 Trade Order Endpoint
app.post('/place-order', async (req, res) => {
  const { category, symbol, side, orderType, qty, takeProfit, stopLoss, timeInForce } = req.body;

  const timestamp = Date.now().toString();
  const recvWindow = "5000";

  const params = {
    category,
    symbol,
    side,
    orderType,
    qty,
    takeProfit,
    stopLoss,
    timeInForce,
    apiKey: process.env.API_KEY,
    timestamp,
    recvWindow,
  };

  const signature = generateSignature(process.env.API_SECRET, params);
  const API_1M = 'https://api-testnet.bybit.com/v5/market/kline?category=linear&symbol=ETHUSDT&interval=1&limit=100';


  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        sign: signature
      })
    });

    const data = await response.json();
    console.log("✅ Order Response:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Order Error:", err);
    res.status(500).json({ error: "Order failed", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
