const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config(); // Load .env

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const API_KEY = process.env.BYBIT_API_KEY;
const API_SECRET = process.env.BYBIT_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error("❌ Missing API Key or Secret. Check your .env file or Render environment settings.");
  process.exit(1);
}

// 🔐 Signature Generator
function generateSignature(secret, params) {
  const ordered = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(ordered).digest('hex');
}

// 🟢 Order Endpoint
app.post('/place-order', async (req, res) => {
  const { symbol, side, orderType, qty, takeProfit, stopLoss, timeInForce = "IOC", category = "linear" } = req.body;

  const timestamp = Date.now().toString();
  const recvWindow = "5000";

  const params = {
    apiKey: API_KEY,
    category,
    symbol,
    side,
    orderType,
    qty,
    timeInForce,
    takeProfit,
    stopLoss,
    timestamp,
    recvWindow
  };

  // Remove empty fields
  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null) delete params[key];
  });

  const signature = generateSignature(API_SECRET, params);
  const url = 'https://api-testnet.bybit.com/v5/order/create';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, sign: signature })
    });

    const data = await response.json();
    console.log("✅ ORDER RESPONSE:", data);
    res.json(data);
  } catch (error) {
    console.error("❌ ORDER ERROR:", error);
    res.status(500).json({ error: "Order failed", detail: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Croak Gateway live on port ${PORT}`);
});
