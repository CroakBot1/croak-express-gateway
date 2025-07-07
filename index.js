const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const API_KEY = process.env.BYBIT_API_KEY || 'mzHAXKsKNc6TpJK9D3';
const API_SECRET = process.env.BYBIT_API_SECRET || 'pQKjiFJPHwUbfBFggJcp5lRUOc3ggf14cZKs';

// 🔐 Signature Generator
function sign(secret, params) {
  const ordered = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHmac('sha256', secret).update(ordered).digest('hex');
}

// 🟢 Place Order Endpoint
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

  // Remove null/undefined
  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null) {
      delete params[key];
    }
  });

  const signature = sign(API_SECRET, params);
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
  console.log(`🚀 Croak Gateway running on port ${PORT}`);
});
